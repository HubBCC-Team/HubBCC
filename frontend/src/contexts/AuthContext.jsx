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
import { createContext, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "../service/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  // Recupera a sessao salva JA NA CRIACAO do estado (inicializacao preguicosa).
  // Assim o usuario existe desde o primeiro render: o app nao "pisca" no login
  // ao dar F5 e nao precisamos de useEffect + setState.
  const [usuario, setUsuario] = useState(lerSessaoSalva);

  // Mantido para compatibilidade com quem le "carregando" (ex.: RotaPrivada).
  // Como a leitura agora e sincrona, nunca ha espera.
  const carregando = false;

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

// Le o usuario salvo no localStorage; devolve null se nao houver ou se estiver corrompido.
function lerSessaoSalva() {
  const salvo = localStorage.getItem("hubbcc_usuario");
  if (!salvo) return null;
  try {
    return JSON.parse(salvo);
  } catch {
    localStorage.removeItem("hubbcc_usuario");
    return null;
  }
}
