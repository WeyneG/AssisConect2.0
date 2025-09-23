import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: color,
        color: "#fff",
        letterSpacing: 0.4,
      }}
    >
      {label}
    </span>
  );
}

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

  if (effectiveRole !== "ADMIN") {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1>Usuários</h1>
        <p style={{ color: "crimson" }}>Você não tem permissão para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Usuários</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 120px",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input placeholder="Buscar por nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Buscar por email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Todas as roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="FUNCIONARIO">FUNCIONARIO</option>
          <option value="FAMILIAR">FAMILIAR</option>
        </select>
        <select
          value={size}
          onChange={(e) => {
            setSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Nome</th>
                <th align="left">Email</th>
                <th align="left">Role</th>
                <th align="left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td><RoleBadge role={r.role} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(r)}>Editar</button>
                      <button onClick={() => onDelete(r)} style={{ color: "red" }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} align="center">Nenhum resultado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Próxima</button>
      </div>

      {editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, width: 400 }}>
            <h2>Editar Usuário</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder="Nome"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
              <select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="FUNCIONARIO">FUNCIONARIO</option>
                <option value="FAMILIAR">FAMILIAR</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button onClick={() => setEditingUser(null)}>Cancelar</button>
              <button onClick={saveEdit} style={{ background: "#202C4B", color: "#fff" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
