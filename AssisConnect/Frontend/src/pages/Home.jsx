import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [msg, setMsg] = useState("Carregando...");

  useEffect(() => {
    api.get("/exemplo/protegido")
      .then((res) => setMsg(typeof res.data === "string" ? res.data : (res.data?.mensagem || JSON.stringify(res.data))))
      .catch((err) => {
        console.error(err);
        setMsg("Falha ao acessar recurso protegido");
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Área Protegida</h1>
      <p>{msg}</p>
    </div>
  );
}
