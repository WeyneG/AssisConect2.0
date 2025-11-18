

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/sidebar";
import "../perfil.css";
import api from "../services/api";
import IconPerfil from "../assets/btn-perfil.png";


function decodeToken(token) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Perfil() {
  const token = localStorage.getItem("token");
  const tokenInfo = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const [userInfo, setUserInfo] = useState(() => ({
    name: tokenInfo?.name || "",
    email: tokenInfo?.email || "",
    role: tokenInfo?.role || "",
  }));

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/usuarios/me");
        if (res?.data) {
          setUserInfo({
            name: res.data.name || res.data.nome || "",
            email: res.data.email || "",
            role: (res.data.role || "").toString().toUpperCase(),
          });
        }
      } catch (e) {
        console.error("Erro ao carregar /usuarios/me", e);
      }
    }

    if (token) {
      loadUser();
    }
  }, [token]);

  return (
    <div className="home-root">
      <Sidebar />
      <div className="pg-perfil">
        <div className="container">
          <header className="perfil-header">
            <div className="header-left">
              <div className="header-icon">
                <img src={IconPerfil} alt="Perfil" />
              </div>
              <div>
                <h1 className="header-title">Meu Perfil</h1>
                <p className="header-subtitle">
                  Visualize suas informações pessoais e de acesso.
                </p>
              </div>
            </div>
          </header>

          {/* Card de informações do usuário */}
          <section className="card perfil-card">
            <div className="card-title">INFORMAÇÕES DO USUÁRIO</div>
            <div className="perfil-info">
              <div className="perfil-row">
                <span className="perfil-label">Nome completo:</span>
                <span className="perfil-value">{userInfo.name || "—"}</span>
              </div>
              <div className="perfil-row">
                <span className="perfil-label">E-mail:</span>
                <span className="perfil-value">{userInfo.email || "—"}</span>
              </div>
              <div className="perfil-row">
                <span className="perfil-label">Cargo / Função:</span>
                <span className="perfil-value">
                  {(userInfo.role || "").toUpperCase() || "—"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
