import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./RedefinirSenha.css";

const API_BASE_URL = "http://localhost:8080"; 

export default function RedefinirSenha() {
    const navigate = useNavigate();
    const location = useLocation();

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [focusField, setFocusField] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlToken = params.get("token");
        if (!urlToken) {
            setError("Token de redefinição inválido ou ausente.");
        } else {
            setToken(urlToken);
        }
    }, [location.search]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Token de redefinição não encontrado.");
            return;
        }

        if (password.length < 6) {
            setError("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: password,
                }),
            });

            const text = await response.text();

            if (!response.ok) {
                setError(text || "Não foi possível redefinir a senha.");
                return;
            }

            setSuccess(text || "Sua senha foi redefinida com sucesso!");
        
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            console.error(err);
            setError("Erro ao comunicar com o servidor. Tente novamente em instantes.");
        }
    };

    return (
        <div className="reset-container">
            {/* Header lateral igual ao login */}
            <div className="reset-header">
                <img
                    src="public/logoAssist.png"
                    alt="Logo AssisConnect"
                    className="logo-img"
                />
                <h1 className="header-title">Assist Connect</h1>
                <p className="header-subtitle">
                    Sistema de gestão para o cuidado de idosos
                </p>
            </div>

            {/* CARD */}
            <div className="reset-form-area">
                <div className="reset-card">
                    <h2 className="card-title">Redefinir senha</h2>
                    <p className="card-desc">
                        Insira sua nova senha abaixo.
                    </p>

                    {error && <div className="alert-error">{error}</div>}

                    {success && <div className="alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Nova Senha */}
                        <div
                            className={`input-wrapper ${
                                focusField === "password" ? "focus" : ""
                            }`}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField(null)}
                        >
                            <i className="bi bi-lock-fill input-icon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <i
                                className={`bi ${
                                    showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                                } toggle-eye`}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        {/* Confirmar senha */}
                        <div
                            className={`input-wrapper ${
                                focusField === "confirm" ? "focus" : ""
                            }`}
                            onFocus={() => setFocusField("confirm")}
                            onBlur={() => setFocusField(null)}
                        >
                            <i className="bi bi-shield-lock-fill input-icon" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmar nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <i
                                className={`bi ${
                                    showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                                } toggle-eye`}
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            Confirmar nova senha
                        </button>

                        <div className="center-text">
                            <button
                                type="button"
                                className="link-btn"
                                onClick={() => navigate("/login")}
                            >
                                <i className="bi bi-arrow-left" />
                                Voltar ao login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
