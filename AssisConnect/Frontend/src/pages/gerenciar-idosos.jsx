import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../gerenciar-idosos.css";


export default function GerenciarIdosos() {
    // seus estados...
    const [loadingIdosos, setLoadingIdosos] = useState(true);
    const [erroIdosos, setErroIdosos] = useState(false);
    const [idosos, setIdosos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosMap, setUsuariosMap] = useState({});

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
        async function fetchData() {
            try {
                setLoadingIdosos(true);

                const resIdosos = await api.get("/idosos", { headers: auth });
                const resUsuarios = await api.get("/usuarios?size=1000&page=0&sort=name,asc", { headers: auth });

                const idososData = Array.isArray(resIdosos.data.content) ? resIdosos.data.content : resIdosos.data;
                const usuariosData = Array.isArray(resUsuarios.data.content) ? resUsuarios.data.content : resUsuarios.data;

                setIdosos(idososData);
                setUsuarios(usuariosData);

                const map = {};
                usuariosData.forEach((u) => (map[String(u.id)] = u.nome));
                setUsuariosMap(map);

                setLoadingIdosos(false);
            } catch (error) {
                console.error(error);
                setErroIdosos(true);
                setLoadingIdosos(false);
            }
        }
        fetchData();
    }, []);

    // Funções de edição / exclusão
    function openEdit(idoso) {
        setEditForm(idoso);
        setEditing(idoso.id);
    }

    async function saveEdit() {
    try {
        const id = editForm.id;

        await api.put(`/idosos/${id}`, editForm, { headers: auth });

        // Atualiza o estado local com os dados editados
        setIdosos((prev) =>
            prev.map((i) => (i.id === id ? { ...editForm } : i))
        );

        setEditing(null);
    } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Falha ao salvar a edição. Verifique os dados e tente novamente.");
    }
}

    async function handleDelete(id) {
    if (!window.confirm("Deseja realmente remover este idoso?")) return;

    try {
        await api.delete(`/idosos/${id}`, { headers: auth });

        setIdosos((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
        console.error("Erro ao excluir idoso:", error);
        alert("Não foi possível excluir o idoso.");
    }
}

    return (
        <>
            <section className="card list-card">
                <div className="list-header">
                    <div className="card-title small">
                        <div>GERENCIAMENTO DE IDOSOS</div>
                        <p>Adicione, atualize ou remova um idoso da lista.</p>
                    </div>
                </div>

                <h2 className="list-title">
                    IDOSOS <span>CADASTRADOS</span>
                </h2>

                <div className="idoso-list">
                    {loadingIdosos && <div className="list-empty">Carregando...</div>}
                    {erroIdosos && <div className="list-empty">Falha ao carregar.</div>}
                    {!loadingIdosos && !erroIdosos && idosos.length === 0 && (
                        <div className="list-empty">Nenhum idoso cadastrado.</div>
                    )}

                    {!loadingIdosos && !erroIdosos && idosos.length > 0 && (
                        <ul>
                            {idosos.map((i) => (
                                <li key={i.id} className="idoso-item">
                                    <div className="idoso-main">
                                        <strong>{i.nome}</strong>
                                        <span>
                                            Responsável:{" "}
                                            <b>
                                                {usuariosMap[String(i.responsavelId)] ||
                                                    "Responsável não encontrado"}
                                            </b>
                                            <br />
                                            {i.sexo || "—"} • {i.estadoSaude || "—"}
                                        </span>
                                    </div>
                                    <div className="idoso-actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => openEdit(i)}
                                            title="Editar"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleDelete(i.id)}
                                            title="Remover"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {editing && (
                <div className="edit-overlay" onClick={() => setEditing(null)}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Editar Idoso</h3>
                        <div className="edit-grid">
                            <label>
                                Nome
                                <input
                                    type="text"
                                    value={editForm.nome}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, nome: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Data Nascimento
                                <input
                                    type="date"
                                    value={editForm.dataNascimento}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, dataNascimento: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Sexo
                                <select
                                    value={editForm.sexo}
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
                                    value={editForm.estadoSaude}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, estadoSaude: e.target.value })
                                    }
                                    list="estadoSaudeSug2"
                                />
                                <datalist id="estadoSaudeSug2">
                                    <option value="ESTAVEL" />
                                    <option value="OBSERVACAO" />
                                    <option value="GRAVE" />
                                </datalist>
                            </label>
                            <label className="span-2">
                                Observações
                                <textarea
                                    rows={4}
                                    value={editForm.observacoes}
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
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="edit-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setEditing(null)}
                            >
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={saveEdit}>
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
