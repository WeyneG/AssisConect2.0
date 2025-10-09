import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password); // login já deve salvar token no contexto/localStorage
            navigate("/home");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Email ou senha inválidos";
            setError(msg);
        }
    };

    const colors = {
        primary: '#202C4B',   // azul escuro
        secondary: '#5C79C2', // azul claro
        accent: '#D8E0F7',    // bege
        bgForm: '#eee8e8',    // fundo do formulário
        textDark: '#1d2440',  // quase preto
        textLight: '#FFFFFF', // branco
        danger: '#b3261e'     // erro
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        overflow: 'hidden',
    };

    const headerStyle = {
        flex: isMobile ? '0 0 auto' : '1 1 55%',
        backgroundColor: colors.secondary,
        color: colors.textLight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: isMobile ? '24px' : '48px',
        borderRadius: 0,
        boxShadow: '0 8px 22px rgba(0,0,0,.12)',
    };

    const formStyle = {
        flex: isMobile ? '1 1 auto' : '1 1 45%',
        backgroundColor: colors.bgForm,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '16px' : '24px 48px',
        borderRadius: 0,
        boxShadow: '0 8px 22px rgba(0,0,0,.10)',
    };

    const wrapper = (field) => ({
        display: 'flex',
        alignItems: 'center',
        background: colors.accent,
        border: `2px solid ${focusField === field ? colors.primary : colors.secondary}`,
        borderRadius: 10,
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        transition: '0.3s',
        boxShadow: focusField === field ? '0 0 8px rgba(92,64,51,0.6)' : '2px 2px 6px rgba(0,0,0,0.1)'
    });

    const icon = (field) => ({
        fontSize: 22,
        color: focusField === field ? colors.primary : colors.textDark,
        marginRight: 12,
        cursor: 'pointer',
        transition: '0.3s'
    });

    const input = {
        flex: 1,
        background: 'transparent',
        border: 'none',
        color: colors.textDark,
        fontSize: isMobile ? 16 : 18,
        outline: 'none'
    };

    return (
        <div style={containerStyle}>
            {/* Header Section */}
            <div style={headerStyle}>
                <img
                    src="public/logoAssist.png"
                    alt="Logo AssisConnect"
                    style={{
                        width: isMobile ? 100 : 150,
                        height: 'auto',
                        marginBottom: isMobile ? 16 : 24
                    }}
                />
                <h1 style={{ fontSize: isMobile ? '2rem' : '4rem', fontWeight: 800, margin: 0, textShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
                    Assist Connect
                </h1>
                <p style={{ fontSize: isMobile ? '1rem' : '1.5rem', marginTop: '0.5rem', textAlign: 'center', color: colors.textLight, textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>
                    Sistema de gestão para o cuidado de idosos
                </p>
            </div>

            {/* Form Section */}
            <div style={formStyle}>
                <div style={{ width: '100%', maxWidth: 450, background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                    <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 700, color: colors.primary, textAlign: 'center', marginBottom: '0.5rem' }}>
                        Bem-vindo de volta!
                    </h2>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', color: colors.secondary, textAlign: 'center', marginBottom: '1.5rem' }}>
                        Acesse sua conta para continuar
                    </p>

                    {error && (
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: colors.danger, color: '#fff', borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={wrapper('email')} onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}>
                            <i className="bi bi-envelope-fill" style={icon('email')} />
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={input}
                                required
                            />
                        </div>

                        <div style={wrapper('password')} onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)}>
                            <i className="bi bi-lock-fill" style={icon('password')} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={input}
                                required
                            />
                            <i
                                className={showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}
                                style={{ fontSize: 22, color: focusField === 'password' ? colors.primary : colors.textDark, marginLeft: 12, cursor: 'pointer' }}
                                onClick={() => setShowPassword(prev => !prev)}
                            />
                        </div>

                        {/*  Botão "Esqueci minha senha" (alinhado à direita) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '12px' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.primary,
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6
                                }}
                                title="Recuperar acesso"
                            >
                                <i className="bi bi-question-circle" />
                                Esqueci minha senha
                            </button>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: colors.primary,
                                border: 'none',
                                borderRadius: 10,
                                color: colors.textLight,
                                fontSize: isMobile ? 16 : 18,
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                transition: '0.3s',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        >
                            Entrar
                        </button>

                        <div style={{ textAlign: 'center', fontSize: isMobile ? 14 : 16, color: colors.secondary }}>
                            Não tem uma conta?{' '}
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600 }}
                                onClick={() => navigate('/register')}
                            >
                                Cadastre-se
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}