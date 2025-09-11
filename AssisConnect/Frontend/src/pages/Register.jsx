import { useState } from "react";
import "../registro.css";
import LogoRegistro from "../assets/logo-registro.png";
import { useNavigate } from "react-router-dom";


function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [papel, setPapel] = useState("");

  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmar || !papel) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!regexEmail.test(email)) {
      alert("Digite um e-mail válido (ex: usuario@dominio.com)");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres!");
      return;
    }

    if (senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha, papel })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || "Falha no cadastro"}`);
        return;
      }

      const data = await response.json();
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
      
      console.log("Resposta do backend:", data);
    
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro de conexão com o servidor. Tente novamente.");
    }

  };

  return (
    <main id="tela_registro">
      {/* ESQUERDA */}
      <section id="col_esquerda" aria-label="Apresentação">
        <div className="bloco-avatar">
          <img src={LogoRegistro} alt="Logo do Registro" />        </div>
        <div className="marca-wrap">
          <h1 className="marca-titulo">Assist Conect</h1>
          <p className="marca-sub">Cuidar com organização, viver com tranquilidade!</p>
        </div>
      </section>

      {/* DIREITA */}
      <section id="col_direita" aria-label="Formulário">
        <div className="form-wrap">
          <h2 className="form-titulo">Registro</h2>

          <form id="form_registro" onSubmit={handleSubmit}>
            <div className="grupo_campo">
              <label className="rotulo_campo" htmlFor="nome">Nome</label>
              <input
                className="campo_texto"
                id="nome"
                placeholder=" "
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="grupo_campo">
              <label className="rotulo_campo" htmlFor="email">E-mail</label>
              <input
                className="campo_texto"
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="linha-dupla">
              <div className="grupo_campo">
                <label className="rotulo_campo" htmlFor="senha">Senha</label>
                <input
                  className="campo_texto"
                  id="senha"
                  type="password"
                  placeholder=" "
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="grupo_campo">
                <label className="rotulo_campo" htmlFor="confirmar">Confirmar senha</label>
                <input
                  className="campo_texto"
                  id="confirmar"
                  type="password"
                  placeholder=" "
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="grupo_campo">
              <label className="rotulo_campo" htmlFor="papel">Papel</label>
              <select
                className="seletor"
                id="papel"
                value={papel}
                onChange={(e) => setPapel(e.target.value)}
                required
              >
                <option value="" disabled>Selecione um papel...</option>
                <option>Administrador</option>
                <option>Cuidador</option>
                <option>Familiar</option>
              </select>
            </div>

            <div className="acoes_formulario">
              <button type="submit" className="botao_principal">Registrar</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;
