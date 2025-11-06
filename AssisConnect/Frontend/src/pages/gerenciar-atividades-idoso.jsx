// src/pages/gerenciar-atividades-idoso.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../gerenciar-atividades-idoso.css";
import Sidebar from "../components/sidebar";
import IconActivity from "../assets/btn-relatorio.png"; // ajuste o caminho se o arquivo estiver em outro lugar

// Utils
function timeToMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function overlaps(aInicio, aFim, bInicio, bFim) {
  return aInicio < bFim && bInicio < aFim;
}
function formatISOToBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// converte qualquer formato de data que vier (YYYY-MM-DD ou DD/MM/YYYY) e junta com horário
function parseDataHora(a) {
  const d =
    a.data || a.dataAtividade || a.createdAt || a.dt || a.date || "";
  const h =
    a.horario_inicio || a.horarioInicio || a.inicio || a.horaInicio || "00:00";

  if (!d) return new Date(0);

  // normaliza DD/MM/YYYY -> YYYY-MM-DD
  const iso =
    String(d).includes("/")
      ? d.split("/").reverse().join("-")
      : String(d);

  return new Date(`${iso}T${h}`);
}

// resolve o nome do responsável em qualquer formato que o backend mandar
function getResponsavelNome(a, map) {
  const id =
    a.responsavelId ??
    a.responsavel_id ??
    a.responsavel?.id ??
    a.usuarioResponsavelId ??
    null;

  const nomeDireto = a.responsavel?.name || a.responsavel?.nome;
  if (nomeDireto) return nomeDireto;

  if (id != null) {
    const n = map.get(String(id));
    if (n) return n;
  }

  return "Responsável não atribuído";
}

export default function GerenciarAtividadesIdoso() {
  // estados de controle
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [atividades, setAtividades] = useState([]);

  // formulário
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [responsavelId, setResponsavelId] = useState("");

  const [touched, setTouched] = useState({});
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  // responsáveis (somente funcionários)
  const [usuarios, setUsuarios] = useState([]);

  const funcByIdFuncionario = useMemo(() => {
    const m = new Map();
    usuarios
      .filter((f) => (f.role || "").toLowerCase() === "funcionario")
      .forEach((f) => m.set(String(f.id), f.name || f.nome));
    return m;
  }, [usuarios]);

  // carregar atividades
  useEffect(() => {
    const fetchAtividades = async () => {
      setLoading(true);
      setErro("");
      try {
        const res = await api.get("/api/atividades");
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : [];
        setAtividades(list);
      } catch (e) {
        console.error("Erro em GET /api/atividades:", e);
        setErro(e?.response?.data?.message || e.message || "Erro ao carregar atividades.");
      } finally {
        setLoading(false);
      }
    };
    fetchAtividades();
  }, []);

  // carregar usuários (funcionários)
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/usuarios", {
          params: { size: 1000, page: 0, sort: "name,asc" },
        });
        const data = res.data;
        const page = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
        setUsuarios(page || []);
      } catch (e) {
        console.error(e);
        setUsuarios([]);
      }
    };
    fetchUsuarios();
  }, []);

  // filtrar atividades do dia selecionado
  const atividadesDoDia = useMemo(() => {
    if (!data) return [];
    const selected = new Date(data).toISOString().split("T")[0];
    return atividades.filter((a) => {
      const aISO = new Date(a.data).toISOString().split("T")[0];
      return aISO === selected;
    });
  }, [atividades, data]);

  // detectar conflito de horário
  const conflitoExistente = useMemo(() => {
    if (!data || !inicio || !fim) return null;
    const iniMin = timeToMinutes(inicio);
    const fimMin = timeToMinutes(fim);
    if (!(iniMin < fimMin)) return null;
    for (const a of atividadesDoDia) {
      const aIni = timeToMinutes(a.horarioInicio || a.horario_inicio || a.inicio || a.horaInicio || "00:00");
      const aFim = timeToMinutes(a.horarioFim || a.horario_fim || a.fim || a.horaFim || "00:00");
      if (overlaps(iniMin, fimMin, aIni, aFim)) return a;
    }
    return null;
  }, [atividadesDoDia, data, inicio, fim]);

  // validação agregada
  const camposInvalidos = useMemo(() => {
    const invalid = {};
    if (!nome.trim()) invalid.nome = true;
    if (!data) invalid.data = true;
    if (!inicio) invalid.inicio = true;
    if (!fim) invalid.fim = true;
    if (!responsavelId) invalid.responsavelId = true;

    const iniMin = timeToMinutes(inicio);
    const fimMin = timeToMinutes(fim);
    if (inicio && fim && !(iniMin < fimMin)) invalid.intervalo = true;
    if (conflitoExistente) invalid.conflito = true;
    return invalid;
  }, [nome, data, inicio, fim, responsavelId, conflitoExistente]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSucesso("");
    setErro("");
    setTouched({
      nome: true,
      data: true,
      inicio: true,
      fim: true,
      responsavelId: true,
      observacoes: true,
    });

    // não permitir datas passadas
    const dataSelecionada = new Date(data);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);
    if (dataSelecionada < dataAtual) {
      setErro("Não é permitido cadastrar atividades para datas anteriores ao dia atual.");
      return;
    }

    if (Object.keys(camposInvalidos).length > 0) {
      setErro(
        camposInvalidos.conflito
          ? "Conflito de horário com uma atividade existente. Ajuste os horários."
          : camposInvalidos.intervalo
          ? "O horário de término deve ser maior que o horário de início."
          : "Preencha os campos obrigatórios."
      );
      return;
    }

    const payload = {
      nome,
      data: new Date(data).toISOString().split("T")[0],
      horario_inicio: `${inicio}:00`,
      horario_fim: `${fim}:00`,
      responsavel: { id: Number(responsavelId) },
      observacoes,
    };

    try {
        setLoading(true);
        const { data: criado } = await api.post("/api/atividades", payload);
        const normalizado = {
        ...criado,
        responsavelId:
            criado?.responsavelId ??
            criado?.responsavel_id ??
            criado?.responsavel?.id ??
            Number(responsavelId) // fallback do que foi escolhido no form
        };

        setAtividades((prev) => [...prev, normalizado]);
        setSucesso("Atividade cadastrada com sucesso!");

        // limpar todos os campos após salvar
        setNome("");
        setData("");
        setInicio("");
        setFim("");
        setResponsavelId("");
        setObservacoes("");
        setTouched({});
    } catch (e) {
        setErro(e?.response?.data?.message || e.message || "Erro ao salvar atividade.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="home-root">
      <Sidebar />

      <div className="pg-atividade">
        <div className="container">
          {/* HEADER */}
          <header className="atividade-header">
            <div className="header-left">
              <div className="header-icon" aria-hidden>
                <img src={IconActivity} alt="Atividades" />
              </div>
              <div>
                <h1 className="header-title">Gerenciar Atividades</h1>
                <p className="header-subtitle">Crie, edite e visualize as atividades recreativas.</p>
              </div>
            </div>
          </header>

          {/* CARD DO FORM */}
          <section className="atividade-form-card">
            <div className="card-title">CADASTRO DE ATIVIDADES</div>

            {!!erro && <div className="alert error">{erro}</div>}
            {!!sucesso && <div className="alert success">{sucesso}</div>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field span-2">
                  <label>
                    Nome da atividade <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => markTouched("nome")}
                    maxLength={120}
                    placeholder="Ex.: Bingo Musical"
                  />
                  {touched.nome && !nome.trim() && (
                    <small className="req">Informe o nome da atividade.</small>
                  )}
                </div>

                <div className="field">
                  <label>
                    Data <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    onBlur={() => markTouched("data")}
                  />
                  {touched.data && !data && <small className="req">Escolha a data.</small>}
                </div>

                <div className="field">
                  <label>
                    Horário de início <span className="req">*</span>
                  </label>
                  <input
                    type="time"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    onBlur={() => markTouched("inicio")}
                  />
                  {touched.inicio && !inicio && (
                    <small className="req">Defina o horário de início.</small>
                  )}
                </div>

                <div className="field">
                  <label>
                    Horário de término <span className="req">*</span>
                  </label>
                  <input
                    type="time"
                    value={fim}
                    onChange={(e) => setFim(e.target.value)}
                    onBlur={() => markTouched("fim")}
                  />
                  {touched.fim && !fim && (
                    <small className="req">Defina o horário de término.</small>
                  )}
                  {inicio && fim && timeToMinutes(inicio) >= timeToMinutes(fim) && (
                    <small className="req">O término deve ser maior que o início.</small>
                  )}
                </div>

                <div className="field span-2">
                  <label>
                    Responsável (funcionário) <span className="req">*</span>
                  </label>
                  <select
                    value={String(responsavelId || "")}
                    onChange={(e) => setResponsavelId(e.target.value)}
                    onBlur={() => markTouched("responsavelId")}
                    style={{ color: "#111827", background: "#ffffff" }}
                  >
                    <option value="">Selecione</option>
                    {usuarios
                      .filter((u) => (u.role || "").toLowerCase() === "funcionario")
                      .map((u) => (
                        <option key={String(u.id)} value={String(u.id)}>
                          {u.name || u.nome}
                        </option>
                      ))}
                  </select>
                  {touched.responsavelId && !responsavelId && (
                    <small className="req">Selecione o responsável.</small>
                  )}
                </div>

                <div className="field span-2">
                  <label>Observações adicionais</label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex.: Materiais necessários, restrições de saúde, observações..."
                  />
                </div>
              </div>

              {conflitoExistente && (
                <div className="alert" style={{ background: "#fff7ed", border: "1px solid #fde68a", color: "#92400e" }}>
                  Conflito: já existe uma atividade (<strong>{conflitoExistente.nome || conflitoExistente.titulo || "sem nome"}</strong>)
                  em {formatISOToBR(conflitoExistente.data || conflitoExistente.dataAtividade)} de{" "}
                  {conflitoExistente.horarioInicio || conflitoExistente.horario_inicio || conflitoExistente.inicio} a{" "}
                  {conflitoExistente.horarioFim || conflitoExistente.horario_fim || conflitoExistente.fim}.
                </div>
              )}

              <div className="actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Salvando..." : "Salvar atividade"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setNome("");
                    setData("");
                    setInicio("");
                    setFim("");
                    setResponsavelId("");
                    setObservacoes("");
                    setTouched({});
                    setErro("");
                    setSucesso("");
                  }}
                >
                  Limpar
                </button>
              </div>
            </form>
          </section>

          {/* LISTA / TABELA */}
            <section className="table-card">
            <div className="card-title">TODAS AS ATIVIDADES REGISTRADAS</div>

            <div style={{ overflowX: "auto" }}>
                <table>
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Início</th>
                    <th>Término</th>
                    <th>Responsável</th>
                    </tr>
                </thead>
                <tbody>
                    {atividades.length === 0 && (
                    <tr>
                        <td colSpan={5} style={{ color: "#6b7280", paddingTop: 10 }}>
                        Nenhuma atividade cadastrada.
                        </td>
                    </tr>
                    )}

                    {atividades
                    .slice()
                    .sort((a, b) => parseDataHora(a) - parseDataHora(b)) // mais recente primeiro
                    .map((a) => (
                        <tr key={a.id}>
                        <td>{a.nome || a.titulo || "(sem nome)"}</td>
                        <td>{String(a.data).includes("/") ? a.data : formatISOToBR(a.data)}</td>
                        <td>{a.horario_inicio || a.horarioInicio || a.inicio || a.horaInicio || ""}</td>
                        <td>{a.horario_fim || a.horarioFim || a.fim || a.horaFim || ""}</td>
                        <td>{getResponsavelNome(a, funcByIdFuncionario)}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {loading && (
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>Carregando atividades...</p>
            )}
            </section>
        </div>
      </div>
    </div>
  );
}
