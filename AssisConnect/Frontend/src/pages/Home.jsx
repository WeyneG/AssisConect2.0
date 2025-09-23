import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


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
  const [msg, setMsg] = useState("Carregando...");
  const navigate = useNavigate();

  const role = useMemo(() => getRoleFromToken(), []);

  useEffect(() => {
    api
      .get("/exemplo/protegido")
      .then((res) =>
        setMsg(
          typeof res.data === "string"
            ? res.data
            : res.data?.mensagem || JSON.stringify(res.data)
        )
      )
      .catch((err) => {
        console.error(err);
        setMsg("Falha ao acessar recurso protegido");
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Área Protegida</h1>
      <p>{msg}</p>
      {role === "ADMIN" && (
        <button
          onClick={() => navigate("/users")}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            background: "#202C4B",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Gerenciar Usuários
        </button>
      )}
    </div>
  );
}
