import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EsqueciSenha.css";

export default function EsqueciSenha() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [focusField, setFocusField] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [cooldown, setCooldown] = useState(0); // segundos restantes

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // contador do cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateEmail(email)) {
            setError("Formato de email inválido");
            return;
        }

        if (cooldown > 0) {
            setError(`Aguarde ${cooldown}s para solicitar outro envio.`);
            return;
        }

        try {
            // simulação do envio do link
            // substitua pela sua API real: await api.post('/forgot-password', { email });
            setSuccess("Um link de redefinição foi enviado ao seu email.");
            setCooldown(60); // trava de 1 minuto
        } catch (err) {
            setError("Não foi possível enviar o email, tente novamente.");
        }
    };

    return (
        <div className="forgot-container">
            {/* Header visual idêntico ao Login.jsx */}
            <div className="forgot-header">
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

            {/* Área do formulário */}
            <div className="forgot-form-area">
                <div className="forgot-card">
                    <h2 className="card-title">Recuperar senha</h2>
                    <p className="card-desc">
                        Insira seu email para receber o link de redefinição.
                    </p>

                    {error && (
                        <div className="alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSend}>
                        <div
                            className={`input-wrapper ${focusField === "email" ? "focus" : ""}`}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField(null)}
                        >
                            <i className="bi bi-envelope-fill input-icon" />
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={cooldown > 0}
                        >
                            {cooldown > 0 ? `Aguarde ${cooldown}s` : "Enviar link"}
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
