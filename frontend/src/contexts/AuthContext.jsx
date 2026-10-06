/* ---------------------------------------------------------------------------
   contexts/AuthContext.jsx
   CONTEXTO DE AUTENTICACAO.

   Guarda o usuario logado e as funcoes de entrar/cadastrar/sair, disponiveis
   em qualquer componente via useAuth():
     const { usuario, entrar, sair } = useAuth();

   TANSTACK QUERY:
   Ao entrar, cadastrar ou sair, removemos as CONSULTAS em cache
   (removeQueries). Assim um usuario nunca ve dados do usuario anterior.
   Usamos removeQueries, e nao clear(), para nao apagar a propria mutation
   de login que ainda esta em andamento.
--------------------------------------------------------------------------- */
import { createContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "../service/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Recupera a sessao salva ao abrir o app (evita "piscar" no login ao dar F5).
  useEffect(() => {
    const salvo = localStorage.getItem("hubbcc_usuario");
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo));
      } catch {
        localStorage.removeItem("hubbcc_usuario");
      }
    }
    setCarregando(false);
  }, []);

  const salvarSessao = useCallback(
    ({ token, usuario: dadosUsuario }) => {
      queryClient.removeQueries();
      localStorage.setItem("hubbcc_token", token);
      localStorage.setItem("hubbcc_usuario", JSON.stringify(dadosUsuario));
      setUsuario(dadosUsuario);
    },
    [queryClient]
  );

  const entrar = useCallback(
    async (email, senha) => {
      const resposta = await authService.login(email, senha);
      salvarSessao(resposta);
      return resposta.usuario;
    },
    [salvarSessao]
  );

  const cadastrar = useCallback(
    async (dados) => {
      const resposta = await authService.cadastrar(dados);
      salvarSessao(resposta);
      return resposta.usuario;
    },
    [salvarSessao]
  );

  const sair = useCallback(() => {
    localStorage.removeItem("hubbcc_token");
    localStorage.removeItem("hubbcc_usuario");
    queryClient.removeQueries();
    setUsuario(null);
  }, [queryClient]);

  const atualizarUsuario = useCallback((novosDados) => {
    setUsuario((anterior) => {
      const atualizado = { ...anterior, ...novosDados };
      localStorage.setItem("hubbcc_usuario", JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  const value = {
    usuario,
    carregando,
    autenticado: Boolean(usuario),
    entrar,
    cadastrar,
    sair,
    atualizarUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
