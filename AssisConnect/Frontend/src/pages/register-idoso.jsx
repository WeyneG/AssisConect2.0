// src/pages/RegisterIdoso.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

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

    useEffect(() => {
        let mounted = true;
        setLoadingUsuarios(true);

        const token = localStorage.getItem("token");

        api.get("/usuarios", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                const payload = res.data;
                const arr = Array.isArray(payload?.content) ? payload.content : [];
                if (mounted) setUsuarios(arr);
            })
            .catch((err) => {
                console.error("Erro ao buscar usuários:", err, err?.response?.data);
                setErroUsuarios(err);
                setUsuarios([]);
            })
            .finally(() => {
                if (mounted) setLoadingUsuarios(false);
            });

        return () => (mounted = false);
    }, []);


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
                dataNascimento: new Date(dataNascimento).toISOString().split("T")[0], // força YYYY-MM-DD
                sexo, // precisa ser "M" ou "F"
                estadoSaude, // precisa ser "SAUDAVEL", "DOENTE" ou "INTERNADO"
                observacoes,
                responsavelId: Number(responsavel), // garante número
            };

            const token = localStorage.getItem("token"); // pega o token
            const res = await api.post("/idosos", payload, {
                headers: { Authorization: `Bearer ${token}` } // envia o token no header
            });
            console.log("POST /idosos ->", res);
            setSucesso("Idoso registrado com sucesso!");
            setNome("");
            setDataNascimento("");
            setSexo("");
            setEstadoSaude("");
            setObservacoes("");
            setResponsavel("");
        } catch (err) {
            console.error("Erro ao registrar idoso:", err, err?.response?.data);
            const msg = err?.response?.data?.message || err?.response?.data?.error || "Falha ao registrar idoso. Tente novamente.";
            setErro(msg);
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
            <h1>Registrar Idoso</h1>

            {erro && <div style={{ color: "red", marginBottom: "1rem" }}>{erro}</div>}
            {sucesso && <div style={{ color: "green", marginBottom: "1rem" }}>{sucesso}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome completo *</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>

                <div>
                    <label>Data de nascimento *</label>
                    <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                </div>

                <div>
                    <label>Sexo *</label>
                    <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>

                <div>
                    <label>Estado de saúde *</label>
                    <select value={estadoSaude} onChange={(e) => setEstadoSaude(e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="ESTÁVEL">Estável</option>
                        <option value="OBSERVACAO">Observação</option>
                        <option value="GRAVE">Grave</option>
                    </select>
                </div>

                <div>
                    <label>Observações adicionais</label>
                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
                </div>

                <div>
                    <label>Responsável *</label>
                    <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)}>
                        <option value="">Selecione</option>
                        {loadingUsuarios ? (
                            <option>Carregando responsáveis...</option>
                        ) : erroUsuarios ? (
                            <option>Erro ao carregar</option>
                        ) : (
                            usuarios.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.nome}
                                </option>
                            ))
                        )}
                    </select>
                </div>


                <button type="submit" style={{ marginTop: "1rem" }}>Registrar</button>
            </form>
        </div>
    );
}
