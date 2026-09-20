/* ---------------------------------------------------------------------------
   contexts/AuthContext.jsx
   CONTEXTO DE AUTENTICACAO.

   O QUE E UM CONTEXTO (para quem esta comecando em React):
   E uma "caixa" de dados que fica disponivel para TODOS os componentes da
   aplicacao, sem precisar passar props de pai para filho. Aqui guardamos o
   usuario logado e as funcoes de entrar/sair.

   COMO USAR EM QUALQUER TELA:
     import { useAuth } from "../../contexts/useAuth";
     const { usuario, entrar, sair } = useAuth();
--------------------------------------------------------------------------- */

import { createContext, useState, useEffect, useCallback } from "react";
import * as authService from "../service/authService";

// O contexto em si. O arquivo useAuth.js e quem le este objeto.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // usuario = objeto do usuario logado, ou null quando ninguem esta logado.
  const [usuario, setUsuario] = useState(null);

  // carregando = true enquanto verificamos se ja existe sessao salva.
  // Sem isso, o app "pisca" na tela de login ao dar F5 estando logado.
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, tentamos recuperar a sessao salva no localStorage.
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

  // Guarda token e usuario tanto no estado quanto no localStorage.
  const salvarSessao = useCallback(({ token, usuario: dadosUsuario }) => {
    localStorage.setItem("hubbcc_token", token);
    localStorage.setItem("hubbcc_usuario", JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }, []);

  // ENTRAR: chama o service, salva a sessao e devolve o usuario.
  // Se der erro, o service ja lanca uma Error com mensagem amigavel,
  // e a tela de login mostra essa mensagem.
  const entrar = useCallback(
    async (email, senha) => {
      const resposta = await authService.login(email, senha);
      salvarSessao(resposta);
      return resposta.usuario;
    },
    [salvarSessao]
  );

  // CADASTRAR: cria a conta e ja deixa o usuario logado.
  const cadastrar = useCallback(
    async (dados) => {
      const resposta = await authService.cadastrar(dados);
      salvarSessao(resposta);
      return resposta.usuario;
    },
    [salvarSessao]
  );

  // SAIR: limpa tudo.
  const sair = useCallback(() => {
    localStorage.removeItem("hubbcc_token");
    localStorage.removeItem("hubbcc_usuario");
    setUsuario(null);
  }, []);

  // Atualiza dados do perfil em memoria (usado na tela de Perfil).
  const atualizarUsuario = useCallback((novosDados) => {
    setUsuario((anterior) => {
      const atualizado = { ...anterior, ...novosDados };
      localStorage.setItem("hubbcc_usuario", JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  // Tudo que colocarmos em "value" fica acessivel via useAuth().
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
