import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./users.css";

/* === helpers ============================================================= */
function getRoleFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const b64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    const payload = JSON.parse(json);
    return payload?.role ? payload.role.toUpperCase() : null;
  } catch {
    return null;
  }
}

function roleMeta(roleRaw) {
  const role = (roleRaw || "").toString().toUpperCase();
  if (role === "ADMIN") return { label: "ADMIN", color: "#e74c3c" };
  if (role === "FUNCIONARIO") return { label: "FUNCIONARIO", color: "#3498db" };
  if (role === "FAMILIAR") return { label: "FAMILIAR", color: "#2ecc71" };
  return { label: role || "-", color: "#7f8c8d" };
}

function RoleBadge({ role }) {
  const { label, color } = roleMeta(role);
  return (
    <span className="role-badge" style={{ background: color }}>
      {label}
    </span>
  );
}

/* === ui bits ============================================================= */
function ShimmerRow() {
  return (
    <tr className="shimmer-row">
      <td><span className="shimmer block w-56" /></td>
      <td><span className="shimmer block w-64" /></td>
      <td><span className="shimmer chip" /></td>
      <td><span className="shimmer block w-40" /></td>
    </tr>
  );
}

/* === page ================================================================ */
export default function Users() {
  const { user } = useAuth();
  const roleFromToken = useMemo(() => getRoleFromToken(), []);
  const effectiveRole = useMemo(
    () => (user?.role ? user.role.toUpperCase() : roleFromToken || null),
    [user?.role, roleFromToken]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const params = useMemo(() => ({ page, size, nome, email, role }), [page, size, nome, email, role]);

  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / size));

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });

  const loadData = useCallback(() => {
    if (effectiveRole !== "ADMIN") {
      setLoading(false);
      setRows([]);
      setTotal(0);
      setError(null);
      return;
    }
    setLoading(true);
    api
      .get("/usuarios", { params })
      .then((res) => {
        setRows(res.data?.content || []);
        setTotal(res.data?.totalElements || 0);
        setError(null);
      })
      .catch((err) => {
        setError(err?.userMessage || "Não autorizado ou falha ao carregar");
      })
      .finally(() => setLoading(false));
  }, [effectiveRole, params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function startEdit(u) {
    setEditingUser(u);
    setEditData({ name: u.name, email: u.email, role: u.role.toUpperCase() });
  }

  function saveEdit() {
    api
      .put(`/usuarios/${editingUser.id}`, editData)
      .then(() => {
        setEditingUser(null);
        loadData();
      })
      .catch((err) => {
        alert("Erro ao atualizar: " + (err?.response?.data?.message || err.message));
      });
  }

  function onDelete(u) {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${u.name}?`)) return;
    api
      .delete(`/usuarios/${u.id}`)
      .then(() => loadData())
      .catch((err) => {
        alert("Erro ao excluir: " + (err?.response?.data?.message || err.message));
      });
  }

  function clearFilters() {
    setNome("");
    setEmail("");
    setRole("");
    setPage(0);
  }

  if (effectiveRole !== "ADMIN") {
    return (
      <div className="users-container">
        <div className="page-hero">
          <div className="page-hero__icon">👤</div>
          <div>
            <h1 className="page-hero__title">Usuários</h1>
            <p className="page-hero__subtitle">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      {/* HERO / TÍTULO */}
      <div className="page-hero">
        <div className="page-hero__icon">👥</div>
        <div className="page-hero__content">
          <h1 className="page-hero__title">Gerenciamento de Usuários</h1>
          <p className="page-hero__subtitle">Controle de acesso e perfis do sistema.</p>
        </div>
        <div className="page-hero__right">
          <div className="stat-pill">
            <span className="stat-pill__label">Total</span>
            <span className="stat-pill__value">{total}</span>
          </div>
          <button className="btn ghost" onClick={loadData} title="Atualizar lista">
            ↻ Atualizar
          </button>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="page-grid">
        {/* COLUNA ESQUERDA */}
        <div className="col-main">
          {/* FILTROS */}
          <div className="card filters-card">
            <div className="filters-grid">
              <input className="input" placeholder="Buscar por nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <input className="input" placeholder="Buscar por email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Todas as roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="FUNCIONARIO">FUNCIONARIO</option>
                <option value="FAMILIAR">FAMILIAR</option>
              </select>

              <select
                className="input"
                value={size}
                onChange={(e) => {
                  setSize(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>

            <div className="filters-actions">
              <button className="btn ghost" onClick={() => setPage(0)}>Aplicar</button>
              <button className="btn subtle" onClick={clearFilters}>Limpar</button>
            </div>
          </div>

          {/* TABELA */}
          <div className="card table-card">
            <div className="table-wrap">
              <table className="users-table" cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <>
                      <ShimmerRow /><ShimmerRow /><ShimmerRow /><ShimmerRow /><ShimmerRow />
                    </>
                  )}

                  {!loading && rows.map((r) => (
                    <tr key={r.id}>
                      <td className="col-name">
                        <div className="name-stack">
                          <span className="avatar-seed" aria-hidden>{(r?.name || "?")[0]?.toUpperCase()}</span>
                          <div>
                            <div className="name">{r.name}</div>
                            <div className="muted small">ID: {r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{r.email}</td>
                      <td><RoleBadge role={r.role} /></td>
                      <td>
                        <div className="actions">
                          <button className="btn subtle" onClick={() => startEdit(r)}>Editar</button>
                          <button className="btn danger outline" onClick={() => onDelete(r)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty">
                        Nenhum resultado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINAÇÃO */}
            <div className="pagination">
              <button className="btn subtle" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>← Anterior</button>
              <span className="page-info">Página {page + 1} de {totalPages}</span>
              <button className="btn subtle" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Próxima →</button>
            </div>
          </div>
        </div>

        <aside className="col-side">
          <div className="card">
            <h3 className="card-title">Distribuição de Roles</h3>
            <div className="legend">
              <span className="dot" style={{ background: "#e74c3c" }} /> Admin
            </div>
            <div className="legend">
              <span className="dot" style={{ background: "#3498db" }} /> Funcionário
            </div>
            <div className="legend">
              <span className="dot" style={{ background: "#2ecc71" }} /> Familiar
            </div>
            <p className="muted small mt-8">
              Use os filtros ao lado para localizar usuários rapidamente.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Ações rápidas</h3>
            <div className="quick-actions">
              <button className="btn ghost w-full" onClick={loadData}>↻ Recarregar lista</button>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL */}
      {editingUser && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Editar Usuário</h2>
            <div className="modal-body">
              <input
                className="input"
                placeholder="Nome"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
              <select
                className="input"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="FUNCIONARIO">FUNCIONARIO</option>
                <option value="FAMILIAR">FAMILIAR</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn subtle" onClick={() => setEditingUser(null)}>Cancelar</button>
              <button className="btn primary" onClick={saveEdit}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
