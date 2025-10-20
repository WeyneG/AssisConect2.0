// src/pages/register-idoso.jsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import "../register-idoso.css";
import { Link } from "react-router-dom";

export default function RegisterIdoso() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [estadoSaude, setEstadoSaude] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [erroUsuarios, setErroUsuarios] = useState(null);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [idosos, setIdosos] = useState([]);
  const [loadingIdosos, setLoadingIdosos] = useState(true);
  const [erroIdosos, setErroIdosos] = useState(null);

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
    estadoSaude: "",
    observacoes: "",
    responsavelId: "",
  });

  const token = localStorage.getItem("token");
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    loadUsuarios();
    loadIdosos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeUsuarios = (data) => {
    const raw =
      (data && Array.isArray(data.content) && data.content) ||
      (data && Array.isArray(data.data) && data.data) ||
      (Array.isArray(data) && data) ||
      [];

    const arr = raw
      .map((u) => ({
        id: u.id ?? u.userId ?? u.codigo ?? u.idUsuario ?? u.uuid,
        nome: u.nome ?? u.name ?? u.fullName ?? u.username ?? "Sem nome",
      }))
      .filter((u) => u.id != null);

    arr.sort((a, b) =>
      String(a.nome).localeCompare(String(b.nome), "pt-BR", {
        sensitivity: "base",
      })
    );

    return arr;
  };

  const loadUsuarios = () => {
    setLoadingUsuarios(true);
    setErroUsuarios(null);

    api
      .get("/usuarios?size=1000&page=0&sort=name,asc", { headers: auth })
      .then((res) => {
        setUsuarios(normalizeUsuarios(res.data));
      })
      .catch((err) => {
        setErroUsuarios(err);
        setUsuarios([]);
      })
      .finally(() => setLoadingUsuarios(false));
  };

  const loadIdosos = () => {
    setLoadingIdosos(true);
    setErroIdosos(null);

    api
      .get("/idosos", { headers: auth })
      .then((res) => {
        const arr =
          (res.data && Array.isArray(res.data.content) && res.data.content) ||
          (Array.isArray(res.data) && res.data) ||
          [];
        setIdosos(arr || []);
      })
      .catch((err) => {
        setErroIdosos(err);
        setIdosos([]);
      })
      .finally(() => setLoadingIdosos(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !dataNascimento || !sexo || !estadoSaude || !responsavel) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const payload = {
        nome,
        dataNascimento: new Date(dataNascimento).toISOString().split("T")[0],
        sexo,
        estadoSaude,
        observacoes,
        responsavelId: Number(responsavel),
      };

      await api.post("/idosos", payload, { headers: auth });

      setSucesso("Idoso registrado com sucesso!");
      setNome("");
      setDataNascimento("");
      setSexo("");
      setEstadoSaude("");
      setObservacoes("");
      setResponsavel("");

      loadIdosos();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Falha ao registrar idoso. Tente novamente.";
      setErro(msg);
    }
  };

  const toInputDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().split("T")[0];
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover este idoso?")) return;
    try {
      await api.delete(`/idosos/${id}`, { headers: auth });
      loadIdosos();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Falha ao remover."
      );
    }
  };

  const openEdit = (i) => {
    setEditing(i);
    setEditForm({
      nome: i?.nome || "",
      dataNascimento: toInputDate(i?.dataNascimento),
      sexo: i?.sexo || "",
      estadoSaude: i?.estadoSaude || "",
      observacoes: i?.observacoes || "",
      responsavelId: i?.responsavelId != null ? String(i.responsavelId) : "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const payload = {
        nome: editForm.nome,
        dataNascimento: new Date(editForm.dataNascimento)
          .toISOString()
          .split("T")[0],
        sexo: editForm.sexo,
        estadoSaude: editForm.estadoSaude,
        observacoes: editForm.observacoes,
        responsavelId: Number(editForm.responsavelId || 0),
      };
      await api.put(`/idosos/${editing.id}`, payload, { headers: auth });
      setEditing(null);
      loadIdosos();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Falha ao salvar."
      );
    }
  };

  const usuariosMap = useMemo(
    () => Object.fromEntries(usuarios.map((u) => [String(u.id), u.nome])),
    [usuarios]
  );

  return (
    <div className="pg-idoso">
      <div className="container">
        <header className="idoso-header">
          <div className="header-left">
            <div className="header-icon" aria-hidden>
              🏠
            </div>
            <div>
              <h1 className="header-title">Cadastrar Idoso</h1>
              <p className="header-subtitle">Preencha todos os dados solicitados.</p>
            </div>
          </div>

          <Link to="/gerenciar-idosos" className="btn-secondary header-btn">
            Gerenciar Idosos
          </Link>
        </header>

        <div className="grid">
          <section className="card form-card">
            <div className="card-title">CADASTRO</div>

            {erro && <div className="alert error">{erro}</div>}
            {sucesso && <div className="alert success">{sucesso}</div>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label>
                    Nome Completo <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex.: Maria da Luz"
                  />
                </div>

                <div className="field">
                  <label>Estado de Saúde</label>
                  <input
                    type="text"
                    value={estadoSaude}
                    onChange={(e) => setEstadoSaude(e.target.value)}
                    placeholder="Ex.: ESTAVEL / OBSERVACAO / GRAVE"
                    list="estadoSaudeSug"
                  />
                  <datalist id="estadoSaudeSug">
                    <option value="ESTAVEL" />
                    <option value="OBSERVACAO" />
                    <option value="GRAVE" />
                  </datalist>
                </div>

                <div className="field">
                  <label>
                    Data Nascimento <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>

                <div className="field span-2">
                  <label>Observações adicionais</label>
                  <textarea
                    rows={4}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Alergias, medicações, observações clínicas..."
                  />
                </div>

                <div className="field">
                  <label>
                    Sexo <span className="req">*</span>
                  </label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>

                <div className="field">
                  <label>
                    Responsável <span className="req">*</span>
                  </label>
                  <select
                    value={String(responsavel || "")}
                    onChange={(e) => setResponsavel(e.target.value)}
                    style={{ color: "#111827", background: "#ffffff" }}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>

                    {loadingUsuarios && (
                      <option disabled>Carregando responsáveis...</option>
                    )}
                    {!loadingUsuarios && erroUsuarios && (
                      <option disabled>Erro ao carregar responsáveis</option>
                    )}
                    {!loadingUsuarios &&
                      !erroUsuarios &&
                      usuarios.length === 0 && (
                        <option disabled>Nenhum responsável disponível</option>
                      )}

                    {usuarios.map((u) => (
                      <option key={String(u.id)} value={String(u.id)}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary">
                  CADASTRAR
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
