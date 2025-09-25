import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../home.css"; 

// imports dos ícones (assets em src/assets)
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
  const [setMsg] = useState("Carregando...");
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
      .catch((err) => {
        console.error(err);
        setMsg("Falha ao acessar recurso protegido");
      });
  }, []);

  return (
    <div className="home-root">
      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="sb-slot sb-gap" />
        <button className="sb-btn" aria-label="Início">
          <img src={IconHome} alt="Início" className="sb-icon" />
        </button>
        <button className="sb-btn" aria-label="Moradores">
          <img src={IconUsers} alt="Moradores" className="sb-icon" />
        </button>
        <button className="sb-btn" aria-label="Cardápio">
          <img src={IconCardapio} alt="Cardápio" className="sb-icon" />
        </button>
        <button className="sb-btn" aria-label="Relatórios">
          <img src={IconRelatorio} alt="Relatórios" className="sb-icon" />
        </button>
        <div className="sb-spacer" />
        <button className="sb-avatar" aria-label="Perfil">
          <img src={IconPerfil} alt="Perfil" className="sb-icon avatar" />
        </button>
        <button className="sb-btn sb-exit" aria-label="Sair">
          <img src={IconSair} alt="Sair" className="sb-icon" />
        </button>
      </aside>

        {/* GRID DE CONTEÚDO PRINCIPAL */}
        <div className="content-grid">
          {/* Painel Inicial */}
          <section className="card card-hero">
            <div className="hero-icon">
              <img src={IconHome} alt="Painel" className="hero-icon-img" />
            </div>
            <div className="hero-texts">
              <h1 className="hero-title">PAINEL INICIAL</h1>
              <p className="hero-subtitle">
                Ferramenta de Gestão e Apoio ao lar de idosos
              </p>
            </div>
          </section>

          {/* Contador */}
          <section className="card card-counter">
            <div className="counter-number">35</div>
            <div className="counter-label">IDOSOS CADASTRADOS</div>
          </section>

          {/* Cardápio */}
          <section className="card card-block card-menu">
            <header className="block-header">
              <h2 className="block-title">CARDÁPIO</h2>
              <div className="block-subtitle">DO DIA</div>
            </header>
            <ul className="menu-list">
              <li className="menu-item">
                <div className="menu-title">CAFÉ DA MANHÃ</div>
                <div className="menu-desc">
                  Pão integral com ovos e queijo branco.
                </div>
              </li>
              <li className="menu-item">
                <div className="menu-title">ALMOÇO</div>
                <div className="menu-desc">
                  Arroz, feijão, frango grelhado e salada.
                </div>
              </li>
              <li className="menu-item">
                <div className="menu-title">JANTAR</div>
                <div className="menu-desc">
                  Sopa de legumes com torradas de pão.
                </div>
              </li>
            </ul>
          </section>

          {/* Avisos */}
          <section className="card card-block card-notices">
            <header className="block-header">
              <h2 className="block-title">AVISOS</h2>
              <div className="block-subtitle">DO DIA</div>
            </header>
            <ul className="notice-list">
              <li className="notice-item">
                <div className="notice-title">CARLOS NUNES</div>
                <div className="notice-desc">Fisioterapia às 16 horas.</div>
              </li>
              <li className="notice-item">
                <div className="notice-title">JOANA CARDOSO</div>
                <div className="notice-desc">Tomar remédio 17 horas.</div>
              </li>
              <li className="notice-item">
                <div className="notice-title">MARIA DA LUZ</div>
                <div className="notice-desc">
                  Novo remédio passado pela equipe médica.
                </div>
              </li>
              <li className="notice-item">
                <div className="notice-title">JORGE HENRIQUE</div>
                <div className="notice-desc">
                  Apresentou melhora em relação a labirintite.
                </div>
              </li>
            </ul>
          </section>

          {/* Aniversariantes */}
          <section className="card card-birthday">
            <header className="block-header">
              <h2 className="block-title">ANIVERSARIANTES</h2>
              <div className="block-subtitle">DO DIA</div>
            </header>
            <div className="birthday-content">
              <div className="birthday-name">
                CARLOS ALBERTO DA SILVA JUNIOR - <span className="age">63</span>
              </div>
              <div className="balloon">
                <img src={IconBalloon} alt="Balão" className="sb-icon balloon-icon" />
              </div>
            </div>
          </section>
        </div>
        {/* CANVAS PRINCIPAL */}
      <main className="canvas">
        {/* Mensagem de autenticação */}
        <div className="auth-message">
          <div className="auth-left">
            {/* Título Área Protegida não existe no protótipo */}
          </div>
          <div className="auth-right">
            {role === "ADMIN" && (
              <button onClick={() => navigate("/users")} className="btn-manage-users">
                Gerenciar Usuários
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}