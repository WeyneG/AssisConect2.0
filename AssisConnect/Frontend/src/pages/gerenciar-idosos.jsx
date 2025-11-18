import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../gerenciar-idosos.css";
import Sidebar from "../components/sidebar";
import IconUsers from "../assets/btn-users.png";


const toArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (data?._embedded) {
    const k = Object.keys(data._embedded)[0];
    if (k && Array.isArray(data._embedded[k])) return data._embedded[k];
  }
  return [];
};

export default function GerenciarIdosos() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [estadoSaude, setEstadoSaude] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [idosos, setIdosos] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");
  const auth = token ? { Authorization: `Bearer ${token}` } : {};
  const navigate = useNavigate();


  useEffect(() => {
    loadUsuarios();
    loadIdosos();
  }, []);


  const loadUsuarios = async () => {
    const tryFetch = async (url, params) => {
      const res = await api.get(url, { headers: auth, params });
      return toArray(res.data);
    };

    try {
      let data = [];

      try { data = await tryFetch("/api/usuarios", { size: 1000, page: 0, sort: "name,asc" }); } catch {}
      if (!data.length) try { data = await tryFetch("/api/usuarios", { size: 1000, page: 0 }); } catch {}
      if (!data.length) try { data = await tryFetch("/usuarios", { size: 1000, page: 0, sort: "name,asc" }); } catch {}
      if (!data.length) try { data = await tryFetch("/usuarios", { size: 1000, page: 0 }); } catch {}
      if (!data.length) try { data = await tryFetch("/api/usuarios"); } catch {}
      if (!data.length) try { data = await tryFetch("/usuarios"); } catch {}

      data.sort((a, b) => (a?.nome || a?.name || "").localeCompare(b?.nome || b?.name || ""));
      setUsuarios(data);
    } catch (e) {
      console.error("Falha ao carregar usuários:", e);
      setUsuarios([]);
    }
  };


  const loadIdosos = async () => {
    setLoading(true);

    const tryFetch = async (url, params) => {
      const res = await api.get(url, { headers: auth, params });
      return toArray(res.data);
    };

    try {
      let data = [];

      try { data = await tryFetch("/api/idosos", { size: 1000, page: 0, sort: "nome,asc" }); } catch {}
      if (!data.length) try { data = await tryFetch("/api/idosos", { size: 1000, page: 0 }); } catch {}
      if (!data.length) try { data = await tryFetch("/idosos", { size: 1000, page: 0, sort: "nome,asc" }); } catch {}
      if (!data.length) try { data = await tryFetch("/idosos", { size: 1000, page: 0 }); } catch {}
      if (!data.length) try { data = await tryFetch("/api/idosos"); } catch {}
      if (!data.length) try { data = await tryFetch("/idosos"); } catch {}

      data.sort((a, b) => (a?.nome || "").localeCompare(b?.nome || ""));
      setIdosos(data);
    } catch (e) {
      console.error("Erro ao carregar idosos:", e);
      setIdosos([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !dataNascimento || !sexo || !estadoSaude || !responsavel) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      nome,
      dataNascimento: new Date(dataNascimento).toISOString().split("T")[0],
      sexo,
      estadoSaude,
      observacoes,
      responsavelId: Number(responsavel),
    };

    try {
      setLoading(true);

      const { data: novo } = await api.post("/api/idosos", payload, { headers: auth });

      if (novo?.id) {
        setIdosos((prev) =>
          [...(prev || []), novo].sort((a, b) => a.nome.localeCompare(b.nome))
        );
      }

      setSucesso("Idoso cadastrado com sucesso!");
      setNome("");
      setDataNascimento("");
      setSexo("");
      setEstadoSaude("");
      setObservacoes("");
      setResponsavel("");

      await loadIdosos();
    } catch (e) {
      setErro("Erro ao cadastrar idoso.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este idoso?")) return;
    try {
      await api.delete(`/api/idosos/${id}`, { headers: auth });
      setIdosos((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Erro ao excluir idoso.");
    }
  };


  const handleEditSave = async () => {
    if (!editing) return;

    try {
      const body = {
        ...editForm,
        ...(editForm?.responsavelId ? { responsavelId: Number(editForm.responsavelId) } : {}),
      };

      const { data: salvo } = await api.put(`/api/idosos/${editing.id}`, body, { headers: auth });

      setIdosos((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...salvo } : i))
      );

      setEditing(null);
    } catch {
      alert("Erro ao salvar alterações.");
    }
  };

 
  const usuariosMap = useMemo(
    () =>
      Object.fromEntries(
        usuarios.map((u) => [String(u.id), u.nome || u.name || "Sem nome"])
      ),
    [usuarios]
  );

 

  return (
    <div className="home-root">
      <Sidebar />
      <div className="pg-idoso">
        <div className="container">

          {/* HEADER */}
          <header className="idoso-header">
            <div className="header-left">
              <div className="header-icon">
                <img src={IconUsers} alt="Idosos" className="header-icon-img" />
              </div>
              <div>
                <h1 className="header-title">Gerenciar Idosos</h1>
                <p className="header-subtitle">Cadastre, edite ou remova idosos cadastrados.</p>
              </div>
            </div>
          </header>

          {/* FORM CADASTRO */}
          <section className="card form-card">
            <div className="card-title">CADASTRO DE IDOSO</div>

            {erro && <div className="alert error">{erro}</div>}
            {sucesso && <div className="alert success">{sucesso}</div>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-grid">

                {/* Nome */}
                <div className="field">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex.: Maria da Luz"
                  />
                </div>

                {/* Data de nascimento */}
                <div className="field">
                  <label>Data de Nascimento *</label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>

                {/* Sexo */}
                <div className="field">
                  <label>Sexo *</label>
                  <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>

                {/* Estado de saúde */}
                <div className="field">
                  <label>Estado de Saúde *</label>
                  <select
                    value={estadoSaude}
                    onChange={(e) => setEstadoSaude(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="ESTAVEL">Estável</option>
                    <option value="OBSERVACAO">Em observação</option>
                    <option value="GRAVE">Grave</option>
                  </select>
                </div>

                {/* Observações */}
                <div className="field span-2">
                  <label>Observações</label>
                  <textarea
                    rows={3}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Alergias, medicações, observações clínicas..."
                  />
                </div>

                {/* Responsável */}
                <div className="field">
                  <label>Responsável *</label>
                  <select
                    value={String(responsavel || "")}
                    onChange={(e) => setResponsavel(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome || u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Salvando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </section>

          {/* LISTA DE IDOSOS */}
          <section className="card list-card">
            <div className="card-title">IDOSOS CADASTRADOS</div>

            {loading && <div className="list-empty">Carregando...</div>}
            {!loading && idosos.length === 0 && (
              <div className="list-empty">Nenhum idoso cadastrado.</div>
            )}

            {!loading && idosos.length > 0 && (
              <ul className="idoso-list">
                {idosos.map((i) => (
                  <li key={i.id} className="idoso-item">
                    <div className="idoso-main">
                      <strong>{i.nome}</strong>

                      <span>
                        Responsável:{" "}
                        <b>
                          {
                            i.responsavelNome ||                 
                            usuariosMap[String(i.responsavelId)] ||
                            "Não informado"
                          }
                        </b>
                        <br />
                        {i.sexo || "—"} • {i.estadoSaude || "—"}
                      </span>
                    </div>

                    {/* AÇÕES */}
                    <div className="idoso-actions">
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setEditing(i);
                          setEditForm({
                            ...i,
                            responsavelId:
                              i.responsavelId ?? "",
                          });
                        }}
                        title="Editar"
                      >
                        ✎
                      </button>

                      <button
                        className="icon-btn"
                        onClick={() => handleDelete(i.id)}
                        title="Excluir"
                      >
                        🗑
                      </button>

                      <button
                        className="btn-view-acts"
                        onClick={() => navigate(`/atividades-por-idoso/${i.id}`)}
                        title="Ver atividades"
                      >
                        Ver atividades
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* MODAL DE EDIÇÃO */}
          {editing && (
            <div className="edit-overlay" onClick={() => setEditing(null)}>
              <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Editar Idoso</h3>

                <div className="edit-grid">

                  <label>
                    Nome
                    <input
                      type="text"
                      value={editForm.nome || ""}
                      onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    />
                  </label>

                  <label>
                    Data Nascimento
                    <input
                      type="date"
                      value={editForm.dataNascimento || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          dataNascimento: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Sexo
                    <select
                      value={editForm.sexo || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sexo: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="F">Feminino</option>
                      <option value="M">Masculino</option>
                    </select>
                  </label>

                  <label>
                    Estado de Saúde
                    <input
                      type="text"
                      value={editForm.estadoSaude || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, estadoSaude: e.target.value })
                      }
                      list="estadoSaudeSug"
                    />
                    <datalist id="estadoSaudeSug">
                      <option value="ESTAVEL" />
                      <option value="OBSERVACAO" />
                      <option value="GRAVE" />
                    </datalist>
                  </label>

                  <label className="span-2">
                    Observações
                    <textarea
                      rows={4}
                      value={editForm.observacoes || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, observacoes: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Responsável
                    <select
                      value={String(editForm.responsavelId || "")}
                      onChange={(e) =>
                        setEditForm({ ...editForm, responsavelId: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      {usuarios.map((u) => (
                        <option key={String(u.id)} value={String(u.id)}>
                          {u.nome || u.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="edit-actions">
                  <button className="btn-secondary" onClick={() => setEditing(null)}>
                    Cancelar
                  </button>

                  <button className="btn-primary" onClick={handleEditSave}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
