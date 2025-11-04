import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Users from "./pages/Users";
import RegisterIdoso from "./pages/register-idoso";
import GerenciarIdosos from "./pages/gerenciar-idosos";
import GerenciarAtividadesIdoso from "./pages/gerenciar-atividades-idoso";



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Primeira tela = Login */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Área protegida após login */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register-idoso"
            element={
              <ProtectedRoute>
                <RegisterIdoso />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

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


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
