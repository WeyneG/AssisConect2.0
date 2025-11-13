import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../gerenciar-cardapio.css";
import Sidebar from "../components/sidebar";
import IconFood from "../assets/btn-cardapio.png";

function formatISOToBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function GerenciarCardapio() {
  const [data, setData] = useState("");
  const [cafe, setCafe] = useState("");
  const [almoco, setAlmoco] = useState("");
  const [jantar, setJantar] = useState("");
  const [cardapios, setCardapios] = useState([]);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarCardapios();
  }, []);

  const carregarCardapios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cardapios");

      const lista =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.content)
          ? res.data.content
          : [];

      setCardapios(lista);
    } catch (e) {
      setErro("Erro ao carregar cardápios.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSucesso("");
    setErro("");

    if (!data || !cafe || !almoco || !jantar) {
      setErro("Preencha todos os campos antes de salvar.");
      return;
    }

    const payload = {
      data: new Date(data).toISOString().split("T")[0],
      cafeDaManha: cafe,
      almoco: almoco,
      jantar: jantar,
    };

    try {
      setLoading(true);
      const { data: criado } = await api.post("/api/cardapios", payload);

      setCardapios((prev) => [...prev, criado]);
      setSucesso("Cardápio salvo com sucesso!");

      setData("");
      setCafe("");
      setAlmoco("");
      setJantar("");
    } catch (e) {
      console.error(e);
      setErro("Erro ao salvar o cardápio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este cardápio?")) return;

    try {
      await api.delete(`/api/cardapios/${id}`);
      setCardapios((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert("Erro ao remover cardápio.");
    }
  };


  const salvarEdicao = async () => {
    if (!editando) return;

    const payload = {
      data: new Date(editando.data).toISOString().split("T")[0],
      cafeDaManha: editando.cafeDaManha,
      almoco: editando.almoco,
      jantar: editando.jantar,
    };

    try {
      const res = await api.put(`/api/cardapios/${editando.id}`, payload);

      setCardapios((prev) =>
        prev.map((c) => (c.id === editando.id ? res.data : c))
      );

      setSucesso("Cardápio atualizado com sucesso!");
      setEditando(null);
    } catch (e) {
      console.error(e);
      setErro("Erro ao atualizar o cardápio.");
    }
  };

  return (
    <div className="home-root">
      <Sidebar />

      {}
      {editando && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Cardápio</h2>

            <div className="modal-field">
              <label>Data</label>
              <input
                type="date"
                value={editando.data}
                onChange={(e) =>
                  setEditando({ ...editando, data: e.target.value })
                }
              />
            </div>

            <div className="modal-field">
              <label>Café da Manhã</label>
              <textarea
                rows={2}
                value={editando.cafeDaManha}
                onChange={(e) =>
                  setEditando({ ...editando, cafeDaManha: e.target.value })
                }
              />
            </div>

            <div className="modal-field">
              <label>Almoço</label>
              <textarea
                rows={2}
                value={editando.almoco}
                onChange={(e) =>
                  setEditando({ ...editando, almoco: e.target.value })
                }
              />
            </div>

            <div className="modal-field">
              <label>Jantar</label>
              <textarea
                rows={2}
                value={editando.jantar}
                onChange={(e) =>
                  setEditando({ ...editando, jantar: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={salvarEdicao}>
                Salvar alterações
              </button>
              <button
                className="btn-secondary"
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pg-cardapio">
        <div className="container">
          <header className="cardapio-header">
            <div className="header-left">
              <div className="header-icon">
                <img src={IconFood} alt="Cardápio" />
              </div>
              <div>
                <h1 className="header-title">Gerenciar Cardápio do Dia</h1>
                <p className="header-subtitle">
                  Registre e visualize o cardápio diário de refeições.
                </p>
              </div>
            </div>
          </header>

          <section className="card card-form">
            <div className="card-title">REGISTRO DE CARDÁPIO</div>

            {erro && <div className="alert error">{erro}</div>}
            {sucesso && <div className="alert success">{sucesso}</div>}

            <form onSubmit={handleSubmit} className="form">
              <div className="form-grid">
                <div className="field">
                  <label>Data do cardápio *</label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>

                <div className="field span-2">
                  <label>Café da Manhã *</label>
                  <textarea
                    rows={2}
                    value={cafe}
                    onChange={(e) => setCafe(e.target.value)}
                    placeholder="Ex: Pão com ovo, café e leite..."
                  />
                </div>

                <div className="field span-2">
                  <label>Almoço *</label>
                  <textarea
                    rows={2}
                    value={almoco}
                    onChange={(e) => setAlmoco(e.target.value)}
                    placeholder="Ex: Arroz, feijão, carne assada e salada..."
                  />
                </div>

                <div className="field span-2">
                  <label>Jantar *</label>
                  <textarea
                    rows={2}
                    value={jantar}
                    onChange={(e) => setJantar(e.target.value)}
                    placeholder="Ex: Sopa de carne com legumes..."
                  />
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Cardápio"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setData("");
                    setCafe("");
                    setAlmoco("");
                    setJantar("");
                    setErro("");
                    setSucesso("");
                  }}
                >
                  Limpar
                </button>
              </div>
            </form>
          </section>

          <section className="table-card">
            <div className="card-title">CARDÁPIOS REGISTRADOS</div>

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Café da Manhã</th>
                    <th>Almoço</th>
                    <th>Jantar</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {cardapios.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ color: "#6b7280" }}>
                        Nenhum cardápio registrado.
                      </td>
                    </tr>
                  )}

                  {cardapios
                    .slice()
                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                    .map((c) => (
                      <tr key={c.id}>
                        <td>{formatISOToBR(c.data)}</td>
                        <td>{c.cafeDaManha}</td>
                        <td>{c.almoco}</td>
                        <td>{c.jantar}</td>
                        <td>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditando(c)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => handleDelete(c.id)}
                            style={{ marginLeft: "6px" }}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
