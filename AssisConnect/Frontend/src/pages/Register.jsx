import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data || { error: "Falha no cadastro" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registrar</h2>

        <input placeholder="Seu nome" value={name} onChange={(e)=>setName(e.target.value)} className={errors?.name ? "input error" : "input"} />
        {errors?.name && <small className="err">{errors.name}</small>}

        <input type="email" placeholder="email@dominio.com" value={email} onChange={(e)=>setEmail(e.target.value)} className={errors?.email ? "input error" : "input"} />
        {errors?.email && <small className="err">{errors.email}</small>}

        <input type="password" placeholder="Senha (mín. 6)" value={password} onChange={(e)=>setPassword(e.target.value)} className={errors?.password ? "input error" : "input"} />
        {errors?.password && <small className="err">{errors.password}</small>}

        {errors?.error && <small className="err">{errors.error}</small>}

        <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Criar conta"}</button>
        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </div>
  );
}