import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const backendMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data?.detail;

    if (status === 400 || status === 401) {
      err.userMessage = backendMsg || "Email ou senha inválidos";
    } else if (!err.response) {
      err.userMessage = "Falha de conexão com o servidor";
    }

    return Promise.reject(err);
  }
);


export const dashboardService = {
  getIdososCount: () => api.get("/idosos/count"),

  getAniversariantes: () => api.get("/idosos/aniversariantes"),


  getCardapioHoje: () => api.get("/api/cardapios/hoje"),
};


export default api;
