import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const API_BASE = import.meta?.env?.VITE_API_URL || "";
const ROTAS = {
    LISTAR: `${API_BASE}/api/atividades`,
    CRIAR: `${API_BASE}/api/atividades`,
};

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

export default function GerenciarAtividadesIdoso() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [atividades, setAtividades] = useState([]);

    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [touched, setTouched] = useState({});
    const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

    const [usuarios, setUsuarios] = useState([]);

    const [responsavelId, setResponsavelId] = useState("");

    const funcById = useMemo(() => {
        const m = new Map();
        usuarios.forEach(f => m.set(String(f.id), f.name));
        return m;
    }, [usuarios]);

    const funcByIdFuncionario = useMemo(() => {
        const m = new Map();
        usuarios.filter(f => f.role === "funcionario").forEach(f => m.set(String(f.id), f.name));
        return m;
    }, [usuarios]);



    useEffect(() => {
        const fetchAtividades = async () => {
            setLoading(true);
            setErro("");
            try {
                console.log("API_BASE =", API_BASE, "hasToken =", !!localStorage.getItem("token"));

                const res = await api.get("/api/atividades");
                const data = res.data;
                const list = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
                setAtividades(list);

            } catch (e) {
                console.error("Erro em GET /api/atividades:", e);
                setErro(e.message || "Erro ao carregar atividades.");
            } finally {

                setLoading(false);
            }
        };
        fetchAtividades();
    }, []);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await api.get("/usuarios", {
                    params: { size: 1000, page: 0, sort: "name,asc" }
                });
                const data = res.data;

                const page = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);

                const somenteFuncionarios = page.filter(u => (u.role || "").toLowerCase() === "funcionario");

                setUsuarios(somenteFuncionarios);


            } catch (e) {
                console.error(e);
                setUsuarios([]);
            }
        };

        fetchUsuarios();
    }, []);


    const atividadesDoDia = useMemo(() => {
        if (!data) return [];

        const formattedData = new Date(data).toISOString().split('T')[0];
        return atividades.filter((a) => {
            const atividadeData = new Date(a.data).toISOString().split('T')[0]; 
            return atividadeData === formattedData;
        });
    }, [atividades, data]);


    const conflitoExistente = useMemo(() => {
        if (!data || !inicio || !fim) return null;
        const iniMin = timeToMinutes(inicio);
        const fimMin = timeToMinutes(fim);
        if (!(iniMin < fimMin)) return null;

        for (const a of atividadesDoDia) {
            const aIni = timeToMinutes(a.horarioInicio || a.inicio || a.horaInicio || "00:00");
            const aFim = timeToMinutes(a.horarioFim || a.fim || a.horaFim || "00:00");
            if (overlaps(iniMin, fimMin, aIni, aFim)) return a;
        }
        return null;
    }, [atividadesDoDia, data, inicio, fim]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSucesso("");
        setErro("");
        setTouched({ nome: true, data: true, inicio: true, fim: true, responsavelId: true, observacoes: true });

        const dataSelecionada = new Date(data);
        const dataAtual = new Date();

        dataAtual.setHours(0, 0, 0, 0);
        dataSelecionada.setHours(0, 0, 0, 0); 

        if (dataSelecionada < dataAtual) {
            setErro("Não é permitido cadastrar atividades para datas anteriores ao dia atual. Apenas para os dias seguintes.");
            return; 
        }

        if (Object.keys(camposInvalidos).length > 0) {
            setErro(
                camposInvalidos.conflito
                    ? "Conflito de horário detectado com uma atividade existente. Ajuste os horários."
                    : camposInvalidos.intervalo
                        ? "O horário de término deve ser maior que o horário de início."
                        : "Preencha os campos obrigatórios."
            );
            return;
        }


        if (Object.keys(camposInvalidos).length > 0) {
            setErro(
                camposInvalidos.conflito
                    ? "Conflito de horário detectado com uma atividade existente. Ajuste os horários."
                    : camposInvalidos.intervalo
                        ? "O horário de término deve ser maior que o horário de início."
                        : "Preencha os campos obrigatórios."
            );
            return;
        }

        const payload = {
            nome,
            data: new Date(data).toISOString().split('T')[0],
            horario_inicio: `${inicio}:00`,
            horario_fim: `${fim}:00`,
            responsavel: { id: Number(responsavelId) },
            observacoes,
        };


        try {
            setLoading(true);
            const { data: criado } = await api.post("/api/atividades", payload);

            setAtividades((prev) => [...prev, criado]);
            setSucesso("Atividade cadastrada com sucesso!");
            setNome("");
            setInicio("");
            setFim("");
            setResponsavelId("");
            setObservacoes("");
            setTouched({});
        } catch (e) {
            setErro(e.message || "Erro ao salvar atividade.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 py-6 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Cadastrar Atividade Recreativa</h1>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="text-sm px-3 py-2 rounded-lg border border-slate-300 hover:bg-white bg-slate-100"
                    >
                        Atualizar
                    </button>
                </div>

                {!!erro && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                        {erro}
                    </div>
                )}
                {!!sucesso && (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 text-sm">
                        {sucesso}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome da atividade <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    onBlur={() => markTouched("nome")}
                                    maxLength={120}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${touched.nome && !nome.trim() ? "border-red-400 ring-1 ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-slate-200"
                                        }`}
                                    placeholder="Ex.: Bingo Musical"
                                />
                                {touched.nome && !nome.trim() && (
                                    <p className="text-xs text-red-500 mt-1">Informe o nome da atividade.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Data <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    onBlur={() => markTouched("data")}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${touched.data && !data ? "border-red-400 ring-1 ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-slate-200"
                                        }`}
                                />
                                {touched.data && !data && (
                                    <p className="text-xs text-red-500 mt-1">Escolha a data.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Horário de início <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={inicio}
                                    onChange={(e) => setInicio(e.target.value)}
                                    onBlur={() => markTouched("inicio")}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${touched.inicio && !inicio ? "border-red-400 ring-1 ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-slate-200"
                                        }`}
                                />
                                {touched.inicio && !inicio && (
                                    <p className="text-xs text-red-500 mt-1">Defina o horário de início.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Horário de término <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={fim}
                                    onChange={(e) => setFim(e.target.value)}
                                    onBlur={() => markTouched("fim")}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${touched.fim && !fim ? "border-red-400 ring-1 ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-slate-200"
                                        }`}
                                />
                                {touched.fim && !fim && (
                                    <p className="text-xs text-red-500 mt-1">Defina o horário de término.</p>
                                )}
                                {inicio && fim && timeToMinutes(inicio) >= timeToMinutes(fim) && (
                                    <p className="text-xs text-red-500 mt-1">O término deve ser maior que o início.</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Responsável (funcionário) <span className="text-red-500">*</span>
                                </label>

                                <select
                                    value={String(responsavelId || "")}
                                    onChange={(e) => setResponsavelId(e.target.value)}
                                    onBlur={() => markTouched("responsavelId")}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${touched.responsavelId && !responsavelId
                                        ? "border-red-400 ring-1 ring-red-200"
                                        : "border-slate-300 focus:ring-2 focus:ring-slate-200"
                                        }`}
                                >
                                    <option value="">Selecione</option>
                                    {usuarios.map((u) => (
                                        <option key={String(u.id)} value={String(u.id)}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Observações adicionais</label>
                                <textarea
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="Ex.: Materiais necessários, restrições de saúde, observações..."
                                />
                            </div>
                        </div>

                        {conflitoExistente && (
                            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">
                                Conflito: já existe uma atividade (<strong>{conflitoExistente.nome || conflitoExistente.titulo || "sem nome"}</strong>) em {formatISOToBR(conflitoExistente.data || conflitoExistente.dataAtividade)} de {conflitoExistente.horarioInicio || conflitoExistente.inicio} a {conflitoExistente.horarioFim || conflitoExistente.fim}.
                            </div>
                        )}

                        <div className="flex gap-2 mt-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 disabled:opacity-60"
                            >
                                {loading ? "Salvando..." : "Salvar atividade"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setNome("");
                                    setInicio("");
                                    setData("");
                                    setFim("");
                                    setResponsavelId("");
                                    setObservacoes("");
                                    setTouched({});
                                }}
                                className="rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-4 py-2 hover:bg-slate-50"
                            >
                                Limpar
                            </button>
                        </div>
                    </form>

                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base md:text-lg font-semibold text-slate-800">Atividades do dia selecionado</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-600">
                                        <th className="py-2 pr-3">Nome</th>
                                        <th className="py-2 pr-3">Data</th>
                                        <th className="py-2 pr-3">Início</th>
                                        <th className="py-2 pr-3">Término</th>
                                        <th className="py-2">Responsável</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!data && (
                                        <tr>
                                            <td className="py-2 text-slate-500" colSpan={5}>
                                                Selecione uma <strong>data</strong> para carregar as atividades.
                                            </td>
                                        </tr>
                                    )}

                                    {data && atividadesDoDia.length === 0 && (
                                        <tr>
                                            <td className="py-2 text-slate-500" colSpan={5}>
                                                Sem atividades em {formatISOToBR(data)}.
                                            </td>
                                        </tr>
                                    )}

                                    {data && atividadesDoDia.map((a) => (
                                        <tr key={a.id} className="border-t border-slate-100">
                                            <td className="py-2 pr-3">{a.nome || a.titulo || "(sem nome)"}</td>
                                            <td className="py-2 pr-3">{formatISOToBR(a.data)}</td>
                                            <td className="py-2 pr-3">
                                                {a.horario_inicio || a.inicio || a.horaInicio || ""}
                                            </td>
                                            <td className="py-2 pr-3">
                                                {a.horario_fim || a.fim || a.horaFim || ""}
                                            </td>
                                            <td className="py-2">
                                                {funcByIdFuncionario.get(String(a.responsavelId)) || a.nome || "Responsável não atribuído"}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {loading && (
                            <p className="text-xs text-slate-500 mt-3">Carregando atividades...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
