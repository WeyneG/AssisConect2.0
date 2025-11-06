// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Users from "./pages/Users";
// ❌ import RegisterIdoso from "./pages/register-idoso";
import GerenciarIdosos from "./pages/gerenciar-idosos";
import GerenciarAtividadesIdoso from "./pages/gerenciar-atividades-idoso";
import GerenciarCardapio from "./pages/gerenciar-cardapio";
import Perfil from "./pages/Perfil";
import AlocarAtividade from "./pages/alocar-atividade";
import AtividadesPorIdoso from "./pages/atividades-por-idoso";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Páginas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* 🔁 legado: se alguém acessar /register-idoso, mandamos para /gerenciar-idosos */}
          <Route path="/register-idoso" element={<Navigate to="/gerenciar-idosos" replace />} />

          <Route
            path="/gerenciar-idosos"
            element={
              <ProtectedRoute>
                <GerenciarIdosos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gerenciar-atividades-idoso"
            element={
              <ProtectedRoute>
                <GerenciarAtividadesIdoso />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gerenciar-cardapio"
            element={
              <ProtectedRoute>
                <GerenciarCardapio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alocar-atividade"
            element={
              <ProtectedRoute>
                <AlocarAtividade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/atividades-por-idoso/:id"
            element={
              <ProtectedRoute>
                <AtividadesPorIdoso />
              </ProtectedRoute>
            }
          />
          {/* Rota curinga sempre por último */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
