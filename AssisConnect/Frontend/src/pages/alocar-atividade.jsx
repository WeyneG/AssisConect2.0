import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (data?._embedded) {
    const k = Object.keys(data._embedded)[0];
    if (k && Array.isArray(data._embedded[k])) return data._embedded[k];
  }
  return [];
};

export default function AlocarAtividade() {
  const [atividades, setAtividades] = useState([]);
  const [idosos, setIdosos] = useState([]);
  const [atividadeId, setAtividadeId] = useState("");
  const [selecionados, setSelecionados] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    (async () => {
      try {
        const [a, i] = await Promise.all([
          api.get("/api/atividades", { headers: auth }),
          api.get("/api/idosos", {
            headers: auth,
            params: { size: 1000, page: 0, sort: "nome,asc" },
          }),
        ]);
        setAtividades(toArray(a.data));
        setIdosos(toArray(i.data));
      } catch (e) {
        setMsg(e?.response?.data || e?.message || "Falha ao carregar dados.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id) {
    const next = new Set(selecionados);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelecionados(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!atividadeId) {
      setMsg("Selecione uma atividade.");
      return;
    }
    if (selecionados.size === 0) {
      setMsg("Escolha pelo menos 1 idoso.");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        `/api/atividades/${atividadeId}/alocar`,
        { idosoIds: Array.from(selecionados) },
        { headers: auth }
      );
      setMsg("Alocação realizada com sucesso!");
      setSelecionados(new Set());
    } catch (e) {
      setMsg(e?.response?.data || e?.message || "Erro ao alocar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-with-sidebar">
      <Sidebar />
      <div className="page p-6" style={{ width: "100%" }}>
        <h2>Alocar Idosos em Atividade</h2>

        {msg && (
          <div
            style={{
              margin: "12px 0",
              padding: 12,
              borderRadius: 8,
              background: "#202c4b",
              color: "#fff",
            }}
          >
            {String(msg)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 8 }}>Atividade</label>
          <select
            value={atividadeId}
            onChange={(e) => setAtividadeId(e.target.value)}
            style={{ padding: 8, width: 320, marginBottom: 16 }}
          >
            <option value="">-- selecione --</option>
            {atividades.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome || `Atividade #${a.id}`} — {a.data} {a.horario_inicio}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 16 }}>
            <h3>Idosos</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {idosos.map((i) => (
                <label
                  key={i.id}
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff",
                    color: "#111827",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selecionados.has(i.id)}
                    onChange={() => toggle(i.id)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{i.nome}</div>
                    {i.sexo && <div style={{ opacity: 0.7 }}>Sexo: {i.sexo}</div>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#566AD9",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {loading ? "Alocando..." : "Alocar selecionados"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "transparent",
                color: "#111827",
                cursor: "pointer",
              }}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
