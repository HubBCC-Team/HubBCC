/* ---------------------------------------------------------------------------
   contexts/AuthContext.jsx
   CONTEXTO DE AUTENTICACAO.

   Guarda o usuario logado e as funcoes de entrar/cadastrar/sair, disponiveis
   em qualquer componente via useAuth():
     const { usuario, entrar, sair } = useAuth();

   TANSTACK QUERY:
   Ao entrar, cadastrar ou sair, removemos as consultas em cache.
--------------------------------------------------------------------------- */

import {
  createContext,
  useState,
  useCallback,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import * as authService from "../service/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const [usuario, setUsuario] =
    useState(lerSessaoSalva);

  const carregando = false;

  const salvarSessao = useCallback(
    ({
      token,
      refreshToken,
      usuario: dadosUsuario,
    }) => {
      queryClient.removeQueries();

      localStorage.setItem(
        "hubbcc_token",
        token,
      );

      if (refreshToken) {
        localStorage.setItem(
          "hubbcc_refresh_token",
          refreshToken,
        );
      }

      localStorage.setItem(
        "hubbcc_usuario",
        JSON.stringify(dadosUsuario),
      );

      setUsuario(dadosUsuario);
    },
    [queryClient],
  );

  const entrar = useCallback(
    async (email, senha) => {
      const resposta =
        await authService.login(
          email,
          senha,
        );

      salvarSessao(resposta);

      return resposta.usuario;
    },
    [salvarSessao],
  );

  const cadastrar = useCallback(
    async (dados) => {
      const resposta =
        await authService.cadastrar(
          dados,
        );

      salvarSessao(resposta);

      return resposta.usuario;
    },
    [salvarSessao],
  );

  const sair = useCallback(() => {
    localStorage.removeItem(
      "hubbcc_token",
    );

    localStorage.removeItem(
      "hubbcc_refresh_token",
    );

    localStorage.removeItem(
      "hubbcc_usuario",
    );

    queryClient.removeQueries();

    setUsuario(null);
  }, [queryClient]);

  const atualizarUsuario = useCallback(
    (novosDados) => {
      setUsuario((anterior) => {
        const atualizado = {
          ...anterior,
          ...novosDados,
        };

        localStorage.setItem(
          "hubbcc_usuario",
          JSON.stringify(atualizado),
        );

        return atualizado;
      });
    },
    [],
  );

  const value = {
    usuario,
    carregando,
    autenticado: Boolean(usuario),
    entrar,
    cadastrar,
    sair,
    atualizarUsuario,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function lerSessaoSalva() {
  const salvo = localStorage.getItem(
    "hubbcc_usuario",
  );

  if (!salvo) {
    return null;
  }

  try {
    return JSON.parse(salvo);
  } catch {
    localStorage.removeItem(
      "hubbcc_usuario",
    );

    localStorage.removeItem(
      "hubbcc_token",
    );

    localStorage.removeItem(
      "hubbcc_refresh_token",
    );

    return null;
  }
}