import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../registro.css";
import HeroImg from "../assets/Logo-registro.png"; // ajuste se seu arquivo tiver outro nome

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [papel, setPapel] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!email.trim()) return setErro("Informe seu e-mail.");
    if (senha.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.");
    if (senha !== confirmar) return setErro("As senhas não conferem.");
    if (!papel) return setErro("Selecione um papel.");

    try {
      setLoading(true);
      await register({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
        role: papel, // admin | funcionario | familiar
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
      setErro(err?.userMessage || "Falha ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="reg__grid">
      {/* ESQUERDA – HERO */}
      <aside className="reg__hero">
        <div className="hero__circle">
          <img src={HeroImg} alt="Assist Conect" />
        </div>
        <h1 className="hero__title">Assist Conect</h1>
        <p className="hero__subtitle">Cuidar com organização, viver com tranquilidade!</p>
      </aside>

      {/* DIREITA – FORM */}
      <main className="reg__panel">
        <div className="panel__content">
          <h2 className="panel__title">Registro</h2>

          {erro && <div className="panel__error">{erro}</div>}

          <form className="panel__form" onSubmit={handleSubmit} noValidate>
            <label className="form__label" htmlFor="nome">Nome</label>
            <input
              id="nome"
              className="form__input"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder=""
              autoComplete="name"
              required
            />

            <label className="form__label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              autoComplete="email"
              required
            />

            <label className="form__label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              className="form__input"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder=""
              autoComplete="new-password"
              minLength={6}
              required
            />

            <label className="form__label" htmlFor="confirmar">Confirmar senha</label>
            <input
              id="confirmar"
              className="form__input"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder=""
              autoComplete="new-password"
              minLength={6}
              required
            />

            <label className="form__label" htmlFor="papel">Papel</label>
            <select
              id="papel"
              className="form__select"
              value={papel}
              onChange={(e) => setPapel(e.target.value)}
              required
            >
              <option value="">Selecione um papel...</option>
              <option value="funcionario">Funcionário</option>
              <option value="familiar">Familiar</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="form__button" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>

            <p className="panel__switch">
              Já tem uma conta? <Link to="/">Entrar</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
