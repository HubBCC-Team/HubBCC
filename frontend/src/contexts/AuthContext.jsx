import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { login as apiLogin, register as apiRegister } from "../api/axios";
import api from "../api/axios";
import { PERFIS_CADASTRAVEIS } from "../utils/perfis";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true); // só cobre a restauração da sessão no boot

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsuario(userData);
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Falha ao processar dados salvos de sessão:", error);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!token;
  const perfil = usuario?.profileType ?? null;

  async function handleLogin(dadosLogin) {
    const resposta = await apiLogin("/auth/login", dadosLogin);

    if (!resposta?.token || !resposta?.user) {
      throw new Error("Resposta inesperada do servidor ao fazer login.");
    }

    setUsuario(resposta.user);
    setToken(resposta.token);
    localStorage.setItem("user_token", resposta.token);
    localStorage.setItem("user_data", JSON.stringify(resposta.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${resposta.token}`;

    return resposta.user;
  }

  async function handleRegister(registerData) {
    if (!PERFIS_CADASTRAVEIS.includes(registerData.profileType)) {
      throw new Error("Perfil inválido para autocadastro.");
    }

    return apiRegister("/auth/cadastro", registerData);
  }

  function handleLogout() {
    setUsuario(null);
    setToken("");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    delete api.defaults.headers.common["Authorization"];
  }

  function updateUserData(newUserData) {
    setUsuario((atual) => {
      const atualizado = { ...atual, ...newUserData };
      localStorage.setItem("user_data", JSON.stringify(atualizado));
      return atualizado;
    });
  }

  const authContextValue = useMemo(
    () => ({
      usuario,
      perfil,
      isAuthenticated,
      isLoading,
      handleLogin,
      handleRegister,
      handleLogout,
      updateUserData,
    }),
    [usuario, perfil, isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
