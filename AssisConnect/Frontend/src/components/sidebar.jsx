import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import IconPerfil from "../assets/btn-perfil.png";
import IconHome from "../assets/btn-home.png";
import IconUsers from "../assets/btn-users.png";
import IconCardapio from "../assets/btn-cardapio.png";
import IconRelatorio from "../assets/btn-relatorio.png";
import IconSair from "../assets/btn-sair.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // verifica se a rota atual corresponde à rota do botão
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* HOME */}
        <Link
          to="/home"
          className={`sb-btn ${isActive("/home") ? "active" : ""}`}
          aria-label="Início"
        >
          <img src={IconHome} alt="Início" className="sb-icon" />
        </Link>

        {/* IDOSOS */}
        <Link
          to="/gerenciar-idosos"
          className={`sb-btn ${
            isActive("/gerenciar-idosos") || isActive("/register-idoso")
              ? "active"
              : ""
          }`}
          aria-label="Gerenciar Idosos"
        >
          <img src={IconUsers} alt="Gerenciar Idosos" className="sb-icon" />
        </Link>

        {/* CARDÁPIO */}
        <Link
          to="/gerenciar-cardapio"
          className={`sb-btn ${isActive("/gerenciar-cardapio") ? "active" : ""}`}
          aria-label="Cardápio"
        >
          <img src={IconCardapio} alt="Cardápio" className="sb-icon" />
        </Link>

        {/* ATIVIDADES */}
        <Link
          to="/gerenciar-atividades-idoso"
          className={`sb-btn ${
            isActive("/gerenciar-atividades-idoso") ? "active" : ""
          }`}
          aria-label="Atividades"
        >
          <img src={IconRelatorio} alt="Atividades" className="sb-icon" />
        </Link>
      </div>

      {/* BASE */}
      <div className="sidebar-bottom">
        <Link
          to="/perfil"
          className={`sb-avatar ${isActive("/perfil") ? "active" : ""}`}
        >
          <img src={IconPerfil} alt="Perfil" />
        </Link>

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
