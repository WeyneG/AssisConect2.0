import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";

/* Utils */
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (data?._embedded) {
    const k = Object.keys(data._embedded)[0];
    if (k && Array.isArray(data._embedded[k])) return data._embedded[k];
  }
  return [];
};
const formatISOToBR = (iso) => {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};
const timeToMinutes = (hhmm) => {
  if (!hhmm) return 0;
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};
const parseDataHora = (a) => {
  const d = a.data || a.dataAtividade || a.createdAt || a.dt || a.date || "";
  const h = a.horario_inicio || a.horarioInicio || a.inicio || a.horaInicio || "00:00";
  if (!d) return new Date(0);
  const iso = String(d).includes("/") ? d.split("/").reverse().join("-") : String(d);
  return new Date(`${iso}T${h}`);
};

export default function AtividadesPorIdoso() {
  const { id } = useParams();
  const idNum = Number(id);

  const [atividades, setAtividades] = useState([]);
  const [todasAtividades, setTodasAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  const carregarDoIdoso = async () => {
    setMsg("");
    setLoading(true);
    try {
      // 1) tenta query param
      let r = await api.get(`/api/atividades`, { headers: auth, params: { idosoId: idNum } });
      let data = toArray(r.data);

      // 2) fallback: busca tudo e filtra
      if (!data.length) {
        r = await api.get(`/api/atividades`, { headers: auth });
        const all = toArray(r.data);
        data = all.filter(
          (a) =>
            Number(a?.idosoId) === idNum ||
            Number(a?.idoso?.id) === idNum ||
            Number(a?.idIdoso) === idNum ||
            Number(a?.idoso_id) === idNum
        );
      }

      setAtividades(data);
      if (!data.length) setMsg("Nenhuma atividade para este idoso.");
    } catch (e) {
      const notFound = e?.response?.status === 404 || e?.response?.data === "Not Found";
      setMsg(notFound ? "Nenhuma atividade para este idoso." : "Erro ao consultar atividades.");
    } finally {
      setLoading(false);
    }
  };

  const carregarTodas = async () => {
    try {
      const r = await api.get(`/api/atividades`, { headers: auth });
      setTodasAtividades(toArray(r.data));
    } catch {
      setTodasAtividades([]);
    }
  };

  useEffect(() => {
    if (!idNum) return;
    carregarDoIdoso();
    carregarTodas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idNum]);

  /* Vincular / Desvincular */
  const vincularAoIdoso = async () => {
    setMsg("");
    if (!atividadeSelecionada) {
      setMsg("Selecione uma atividade para adicionar.");
      return;
    }
    try {
      await api.post(
        `/api/atividades/${atividadeSelecionada}/alocar`,
        { idosoIds: [idNum] },
        { headers: auth }
      );
      setMsg("Atividade vinculada com sucesso!");
      setAtividadeSelecionada("");
      await carregarDoIdoso();
    } catch (e) {
      setMsg(e?.response?.data || e?.message || "Falha ao vincular atividade.");
    }
  };

  const desvincularDoIdoso = async (atividadeId) => {
    setMsg("");
    try {
      // 1) tentar DELETE direto com path param
      try {
        await api.delete(`/api/atividades/${atividadeId}/alocar/${idNum}`, { headers: auth });
      } catch {
        // 2) tentar via query
        try {
          await api.delete(`/api/atividades/${atividadeId}/alocar`, {
            headers: auth,
            params: { idosoId: idNum },
          });
        } catch {
          // 3) fallback via POST
          await api.post(
            `/api/atividades/${atividadeId}/desalocar`,
            { idosoIds: [idNum] },
            { headers: auth }
          );
        }
      }
      setMsg("Vínculo removido com sucesso.");
      await carregarDoIdoso();
    } catch (e) {
      setMsg(e?.response?.data || e?.message || "Não foi possível remover o vínculo.");
    }
  };

  /* Edição */
  const abrirEdicao = (a) => {
    setEditando(a);
    setEditForm({
      id: a.id,
      nome: a.nome || a.titulo || "",
      data: a.data || a.dataAtividade || "",
      horario_inicio: a.horario_inicio || a.horarioInicio || a.inicio || "",
      horario_fim: a.horario_fim || a.horarioFim || a.fim || "",
      observacoes: a.observacoes || "",
      responsavel: a?.responsavel?.id
        ? { id: a.responsavel.id }
        : a?.responsavelId
        ? { id: a.responsavelId }
        : undefined,
    });
  };

  const salvarEdicao = async () => {
    setMsg("");
    try {
      const payload = {
        nome: editForm.nome,
        data: String(editForm.data).includes("/")
          ? editForm.data.split("/").reverse().join("-")
          : String(editForm.data),
        horario_inicio:
          editForm.horario_inicio || editForm.horarioInicio || editForm.inicio,
        horario_fim:
          editForm.horario_fim || editForm.horarioFim || editForm.fim,
        observacoes: editForm.observacoes || "",
        ...(editForm.responsavel ? { responsavel: editForm.responsavel } : {}),
      };
      await api.put(`/api/atividades/${editForm.id}`, payload, { headers: auth });
      setMsg("Atividade atualizada com sucesso!");
      setEditando(null);
      await carregarDoIdoso();
      await carregarTodas();
    } catch (e) {
      setMsg(e?.response?.data || e?.message || "Erro ao salvar edição.");
    }
  };

  const atividadesOrdenadas = useMemo(
    () => atividades.slice().sort((a, b) => parseDataHora(a) - parseDataHora(b)),
    [atividades]
  );

  return (
    <div className="home-root">
      <Sidebar />
      <div className="page" style={{ width: "100%" }}>
        <h2>Atividades do Idoso #{idNum}</h2>

        {!!msg && (
          <div
            style={{
              margin: "12px 0",
              padding: 12,
              borderRadius: 8,
              background: "#202c4b",
              color: "#fff",
              maxWidth: 420,
            }}
          >
            {String(msg)}
          </div>
        )}

        {/* Vincular nova */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <label style={{ fontWeight: 600 }}>Adicionar atividade:</label>
          <select
            value={atividadeSelecionada}
            onChange={(e) => setAtividadeSelecionada(e.target.value)}
            style={{ padding: 8, minWidth: 320 }}
          >
            <option value="">-- selecione --</option>
            {todasAtividades.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome || `Atividade #${a.id}`} — {formatISOToBR(a.data)}{" "}
                {a.horario_inicio || a.horarioInicio || a.inicio || ""}
              </option>
            ))}
          </select>
          <button
            onClick={vincularAoIdoso}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#2ea44f",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Vincular
          </button>
        </div>

        {loading ? (
          <p>Carregando atividades…</p>
        ) : atividadesOrdenadas.length === 0 ? (
          <p>Nenhuma atividade para este idoso.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {atividadesOrdenadas.map((a) => (
              <div
                key={a.id}
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  {a.nome || a.titulo || `Atividade #${a.id}`}
                </div>
                <div>Data: {formatISOToBR(a.data || a.dataAtividade || "")}</div>
                <div>
                  Horário: {(a.horario_inicio || a.horarioInicio || a.inicio || "—")} -{" "}
                  {(a.horario_fim || a.horarioFim || a.fim || "—")}
                </div>
                {a.responsavel && (
                  <div style={{ marginTop: 4 }}>
                    Responsável: {a.responsavel?.nome || a.responsavel?.name || a.responsavel}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => abrirEdicao(a)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "#f9fafb",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => desvincularDoIdoso(a.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Remover do idoso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de edição */}
        {editando && (
          <div
            onClick={() => setEditando(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "grid",
              placeItems: "center",
              zIndex: 50,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(560px, 94vw)",
                background: "#fff",
                color: "#111827",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                padding: 20,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Editar atividade #{editForm.id}</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <label style={{ gridColumn: "1 / -1" }}>
                  Nome
                  <input
                    type="text"
                    value={editForm.nome || ""}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>

                <label>
                  Data
                  <input
                    type="date"
                    value={
                      String(editForm.data || "").includes("/")
                        ? editForm.data.split("/").reverse().join("-")
                        : (editForm.data || "")
                    }
                    onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>

                <label>
                  Início
                  <input
                    type="time"
                    value={editForm.horario_inicio || editForm.horarioInicio || editForm.inicio || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        horario_inicio: e.target.value,
                        horarioInicio: e.target.value,
                        inicio: e.target.value,
                      })
                    }
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>

                <label>
                  Término
                  <input
                    type="time"
                    value={editForm.horario_fim || editForm.horarioFim || editForm.fim || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        horario_fim: e.target.value,
                        horarioFim: e.target.value,
                        fim: e.target.value,
                      })
                    }
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>

                <label style={{ gridColumn: "1 / -1" }}>
                  Observações
                  <textarea
                    rows={3}
                    value={editForm.observacoes || ""}
                    onChange={(e) => setEditForm({ ...editForm, observacoes: e.target.value })}
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>
              </div>

              {editForm.horario_inicio &&
                editForm.horario_fim &&
                timeToMinutes(editForm.horario_inicio || editForm.inicio) >=
                  timeToMinutes(editForm.horario_fim || editForm.fim) && (
                  <div style={{ color: "#b91c1c", marginTop: 8 }}>
                    O horário de término deve ser maior que o de início.
                  </div>
                )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  onClick={() => setEditando(null)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#f9fafb",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEdicao}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#566AD9",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
