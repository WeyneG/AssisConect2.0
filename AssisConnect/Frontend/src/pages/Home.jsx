import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Importe a instância api e o novo serviço
import { dashboardService } from "../services/api";

import "../home.css";

import IconPerfil from "../assets/btn-perfil.png";
import IconHome from "../assets/btn-home.png";
import IconUsers from "../assets/btn-users.png";
import IconCardapio from "../assets/btn-cardapio.png";
import IconRelatorio from "../assets/btn-relatorio.png";
import IconSair from "../assets/btn-sair.png";
import IconBalloon from "../assets/ballon.png";

// Função para calcular a idade a partir da data de nascimento (YYYY-MM-DD)
function calculateAge(dateString) {
    if (!dateString) return '';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

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

export default function Home() {
    const [, setMsg] = useState("Carregando...");
    const navigate = useNavigate();
    const role = useMemo(() => getRoleFromToken(), []);

    // NOVOS ESTADOS PARA OS DADOS DINÂMICOS
    const [idososCount, setIdososCount] = useState('...');
    const [aniversariantes, setAniversariantes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoadingData(true);
            try {
                const [countResponse, aniversariantesResponse] = await Promise.all([
                    dashboardService.getIdososCount(),
                    dashboardService.getAniversariantes()
                ]);

                setIdososCount(countResponse.data);
                setAniversariantes(aniversariantesResponse.data);

            } catch (err) {
                console.error("Erro ao carregar dados do Dashboard:", err);
                setMsg(err.userMessage || "Erro ao carregar dados do painel.");
                setIdososCount('ERRO');
            } finally {
                setLoadingData(false);
            }
        }

        // Esta é a chamada que carregará os dados da Home.
        fetchDashboardData();

        // O seu useEffect original pode ser mantido ou removido, dependendo se a rota /exemplo/protegido ainda é necessária.
        // api.get("/exemplo/protegido").then(...).catch(...) 
    }, []);

    const go = (path) => () => navigate(path);

    // Pegamos o primeiro aniversariante para o card de destaque
    const destaqueAniversariante = aniversariantes.length > 0 ? aniversariantes[0] : null;

    return (
        <div className="home-root">
            <aside className="sidebar">
                <div className="sb-slot sb-gap" />
                <button className="sb-btn" aria-label="Início" data-tip="Início" onClick={go("/home")}>
                    <img src={IconHome} alt="Início" className="sb-icon" />
                </button>
                <button className="sb-btn" aria-label="Moradores" data-tip="Moradores" onClick={go("/moradores")}>
                    <img src={IconUsers} alt="Moradores" className="sb-icon" />
                </button>
                <button className="sb-btn" aria-label="Cardápio" data-tip="Cardápio" onClick={go("/cardapio")}>
                    <img src={IconCardapio} alt="Cardápio" className="sb-icon" />
                </button>
                <button className="sb-btn" aria-label="Relatórios" data-tip="Relatórios" onClick={go("/relatorios")}>
                    <img src={IconRelatorio} alt="Relatórios" className="sb-icon" />
                </button>
                <div className="sb-spacer" />
                <button className="sb-avatar" aria-label="Perfil" data-tip="Perfil" onClick={go("/perfil")}>
                    <img src={IconPerfil} alt="Perfil" className="sb-icon avatar" />
                </button>
                <button className="sb-btn sb-exit" aria-label="Sair" data-tip="Sair" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                    <img src={IconSair} alt="Sair" className="sb-icon" />
                </button>
            </aside>

            <div className="page">
                <div className="content-grid">
                    {/* Hero */}
                    <section className="card card-hero">
                        <div className="hero-icon">
                            <img src={IconHome} alt="Painel" className="hero-icon-img" />
                        </div>
                        <div className="hero-texts">
                            <div className="hero-top">
                                <h1 className="hero-title">Painel inicial</h1>
                                {role && <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>}
                            </div>
                            <p className="hero-subtitle">Ferramenta de gestão e apoio ao Lar de Idosos</p>
                        </div>
                    </section>

                    {/* KPI - AGORA DINÂMICO */}
                    <section className="card card-counter">
                        <div className="counter-number">{loadingData ? '...' : idososCount}</div>
                        <div className="counter-label">Idosos cadastrados</div>
                    </section>

                    {/* Cardápio (Ainda Estático - será atualizado depois) */}
                    <section className="card card-block card-menu">
                        <header className="block-header">
                            <h2 className="block-title">Cardápio</h2>
                            <div className="block-subtitle">do dia</div>
                        </header>
                        <ul className="menu-list">
                            <li className="menu-item">
                                <div className="menu-title">Café da manhã</div>
                                <div className="menu-desc">Pão integral com ovos e queijo branco.</div>
                            </li>
                            <li className="menu-item">
                                <div className="menu-title">Almoço</div>
                                <div className="menu-desc">Arroz, feijão, frango grelhado e salada.</div>
                            </li>
                            <li className="menu-item">
                                <div className="menu-title">Jantar</div>
                                <div className="menu-desc">Sopa de legumes com torradas de pão.</div>
                            </li>
                        </ul>
                    </section>

                    {/* Avisos (Ainda Estático - será atualizado depois) */}
                    <section className="card card-block card-notices">
                        <header className="block-header">
                            <h2 className="block-title">Avisos</h2>
                            <div className="block-subtitle">do dia</div>
                        </header>
                        <ul className="notice-list">
                            <li className="notice-item">
                                <div className="notice-title">Carlos Nunes</div>
                                <div className="notice-desc">Fisioterapia às 16h.</div>
                            </li>
                            <li className="notice-item">
                                <div className="notice-title">Joana Cardoso</div>
                                <div className="notice-desc">Tomar remédio às 17h.</div>
                            </li>
                            <li className="notice-item">
                                <div className="notice-title">Maria da Luz</div>
                                <div className="notice-desc">Novo remédio prescrito pela equipe médica.</div>
                            </li>
                            <li className="notice-item">
                                <div className="notice-title">Jorge Henrique</div>
                                <div className="notice-desc">Melhora percebida da labirintite.</div>
                            </li>
                        </ul>
                    </section>

                    {/* Aniversariantes - AGORA DINÂMICO */}
                    <section className="card card-birthday">
                        <header className="block-header">
                            <h2 className="block-title">Aniversariantes</h2>
                            <div className="block-subtitle">de hoje</div>
                        </header>
                        <div className="birthday-content">
                            {loadingData ? (
                                <div className="birthday-name">Carregando...</div>
                            ) : destaqueAniversariante ? (
                                <>
                                    <div className="birthday-name">
                                        {destaqueAniversariante.nome} —
                                        <span className="age">{calculateAge(destaqueAniversariante.dataNascimento)}</span>
                                    </div>
                                    <div className="balloon">
                                        <img src={IconBalloon} alt="Balão" className="sb-icon balloon-icon" />
                                    </div>
                                    {aniversariantes.length > 1 && (
                                        <div className="birthday-more">
                                            e mais {aniversariantes.length - 1}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="birthday-name">Nenhum aniversariante hoje!</div>
                            )}
                        </div>
                    </section>
                </div>

                <main className="canvas">
                    <div className="auth-message">
                        <div className="auth-left" />
                        <div className="auth-right">
                            {role === "ADMIN" && (
                                <div className="admin-actions">
                                    <button
                                        onClick={() => navigate("/register-idoso")}
                                        className="btn-register-idoso"
                                    >
                                        Registrar Idoso
                                    </button>
                                    <button
                                        onClick={() => navigate("/users")}
                                        className="btn-manage-users"
                                    >
                                        Gerenciar Usuários
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}