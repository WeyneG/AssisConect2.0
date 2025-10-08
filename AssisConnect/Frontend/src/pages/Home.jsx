import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../home.css";

import IconPerfil from "../assets/btn-perfil.png";
import IconHome from "../assets/btn-home.png";
import IconUsers from "../assets/btn-users.png";
import IconCardapio from "../assets/btn-cardapio.png";
import IconRelatorio from "../assets/btn-relatorio.png";
import IconSair from "../assets/btn-sair.png";
import IconBalloon from "../assets/ballon.png";

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

  useEffect(() => {
    api
      .get("/exemplo/protegido")
      .then((res) =>
        setMsg(
          typeof res.data === "string"
            ? res.data
            : res.data?.mensagem || JSON.stringify(res.data)
        )
      )
      .catch(() => setMsg("Falha ao acessar recurso protegido"));
  }, []);

  const go = (path) => () => navigate(path);

  return (
    <div className="home-root">
      {/* SIDEBAR */}
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

      {/* CONTEÚDO */}
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

          {/* KPI */}
          <section className="card card-counter">
            <div className="counter-number">35</div>
            <div className="counter-label">Idosos cadastrados</div>
          </section>

          {/* Cardápio */}
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

          {/* Avisos */}
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

          {/* Aniversariantes */}
          <section className="card card-birthday">
            <header className="block-header">
              <h2 className="block-title">Aniversariantes</h2>
              <div className="block-subtitle">de hoje</div>
            </header>
            <div className="birthday-content">
              <div className="birthday-name">
                Carlos Alberto da Silva Junior — <span className="age">63</span>
              </div>
              <div className="balloon">
                <img src={IconBalloon} alt="Balão" className="sb-icon balloon-icon" />
              </div>
            </div>
          </section>
        </div>

        <main className="canvas">
          <div className="auth-message">
            <div className="auth-left" />
            <div className="auth-right">
              {role === "ADMIN" && (
                <button onClick={() => navigate("/users")} className="btn-manage-users">
                  Gerenciar usuários
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
