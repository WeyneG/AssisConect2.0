import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../services/api";
import "../home.css";
import Sidebar from "../components/sidebar";

import IconHome from "../assets/btn-home.png";
import IconBalloon from "../assets/btn-relatorio.png";

// Função para calcular a idade a partir da data de nascimento (YYYY-MM-DD)
function calculateAge(dateString) {
  if (!dateString) return "";
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Lê a role direto do token
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

  // Estados do Dashboard
  const [idososCount, setIdososCount] = useState("...");
  const [aniversariantes, setAniversariantes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);


  const [menuHoje, setMenuHoje] = useState({
    cafe: "",
    almoco: "",
    jantar: "",
  });
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoadingData(true);
      setMenuLoading(true);

      try {
        const [countResponse, aniversariantesResponse, cardapioHojeResponse] =
          await Promise.all([
            dashboardService.getIdososCount(),
            dashboardService.getAniversariantes(),
            dashboardService.getCardapioHoje(), // novo endpoint
          ]);

     
        setIdososCount(countResponse.data);
        setAniversariantes(aniversariantesResponse.data);

        
        const cardapio = cardapioHojeResponse?.data || null;
        if (cardapio) {
          setMenuHoje({
            cafe: cardapio.cafeDaManha || "",
            almoco: cardapio.almoco || "",
            jantar: cardapio.jantar || "",
          });
        } else {
          setMenuHoje({ cafe: "", almoco: "", jantar: "" });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
        setMsg(err.userMessage || "Erro ao carregar dados do painel.");
        setIdososCount("ERRO");
      } finally {
        setLoadingData(false);
        setMenuLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const destaqueAniversariante =
    aniversariantes.length > 0 ? aniversariantes[0] : null;

  return (
    <div className="home-root">
      <Sidebar />

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
                {role && (
                  <span className={`role-badge role-${role.toLowerCase()}`}>
                    {role}
                  </span>
                )}
              </div>
              <p className="hero-subtitle">
                Ferramenta de gestão e apoio ao Lar de Idosos
              </p>
            </div>
          </section>

          {/* KPI - número de idosos */}
          <section className="card card-counter">
            <div className="counter-number">
              {loadingData ? "..." : idososCount}
            </div>
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
                <div className="menu-desc">
                  {menuLoading
                    ? "Carregando..."
                    : menuHoje.cafe || "Nenhum cardápio cadastrado para hoje."}
                </div>
              </li>
              <li className="menu-item">
                <div className="menu-title">Almoço</div>
                <div className="menu-desc">
                  {menuLoading
                    ? "Carregando..."
                    : menuHoje.almoco ||
                      "Nenhum cardápio cadastrado para hoje."}
                </div>
              </li>
              <li className="menu-item">
                <div className="menu-title">Jantar</div>
                <div className="menu-desc">
                  {menuLoading
                    ? "Carregando..."
                    : menuHoje.jantar ||
                      "Nenhum cardápio cadastrado para hoje."}
                </div>
              </li>
            </ul>
          </section>

          {}

          {/* Aniversariantes */}
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
                    {destaqueAniversariante.nome} —{" "}
                    <span className="age">
                      {calculateAge(destaqueAniversariante.dataNascimento)}
                    </span>
                  </div>
                  <div className="balloon">
                    <img
                      src={IconBalloon}
                      alt="Balão"
                      className="sb-icon balloon-icon"
                    />
                  </div>
                  {aniversariantes.length > 1 && (
                    <div className="birthday-more">
                      e mais {aniversariantes.length - 1}
                    </div>
                  )}
                </>
              ) : (
                <div className="birthday-name">
                  Nenhum aniversariante hoje!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Ações administrativas – ÚNICO BLOCO */}
        {role === "ADMIN" && (
          <div className="admin-actions">
            <button
              onClick={() => navigate("/alocar-atividade")}
              className="btn-alocar-atividade"
            >
              Alocar atividade
            </button>
            <button
              onClick={() => navigate("/users")}
              className="btn-manage-users"
            >
              Gerenciar Usuários (ADMIN)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
