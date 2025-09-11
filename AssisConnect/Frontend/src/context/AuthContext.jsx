import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthCtx = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? {} : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    // backend retorna { token, name, email }
    if (!data?.token) throw new Error("Resposta do backend sem token");
    localStorage.setItem("token", data.token);
    setUser({ name: data.name, email: data.email });
    return data;
  }

async function register({ name, email, password, role }) {
    const { data } = await api.post("/auth/register", { name, email, password, role });
    if (!data?.token) throw new Error("Resposta do backend sem token");
    localStorage.setItem("token", data.token);
    setUser({ name: data.name, email: data.email });
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
