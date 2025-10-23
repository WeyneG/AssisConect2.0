import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import IconPerfil from "../assets/btn-perfil.png";
import IconHome from "../assets/btn-home.png";
import IconUsers from "../assets/btn-users.png";
import IconCardapio from "../assets/btn-cardapio.png";
import IconRelatorio from "../assets/btn-relatorio.png";
import IconSair from "../assets/btn-sair.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 detecta qual página está ativa

  const go = (path) => () => navigate(path);

  // função auxiliar pra verificar se a rota atual bate com o botão
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <button
          className={`sb-btn ${isActive("/home") ? "active" : ""}`}
          aria-label="Início"
          onClick={go("/home")}
        >
          <img src={IconHome} alt="Início" className="sb-icon" />
        </button>

        <button
          className={`sb-btn ${isActive("/gerenciar-idosos") || isActive("/register-idoso") ? "active" : ""}`}
          aria-label="Gerenciar Idosos"
          onClick={go("/gerenciar-idosos")}
        >
          <img src={IconUsers} alt="Gerenciar Idosos" className="sb-icon" />
        </button>

        <button
          className={`sb-btn ${isActive("/cardapio") ? "active" : ""}`}
          aria-label="Cardápio"
          onClick={go("/cardapio")}
        >
          <img src={IconCardapio} alt="Cardápio" className="sb-icon" />
        </button>

        <button
          className={`sb-btn ${isActive("/atividades") ? "active" : ""}`}
          aria-label="Atividades"
          onClick={go("/atividades")}
        >
          <img src={IconRelatorio} alt="Atividades" className="sb-icon" />
        </button>
      </div>

      <div className="sidebar-bottom">
        <div
          className={`sb-avatar ${isActive("/perfil") ? "active" : ""}`}
          onClick={go("/perfil")}
        >
          <img src={IconPerfil} alt="Perfil" />
        </div>

        <button
          className="sb-btn sb-exit"
          aria-label="Sair"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <img src={IconSair} alt="Sair" className="sb-icon" />
        </button>
      </div>
    </aside>
  );
}
