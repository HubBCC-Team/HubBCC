/* ---------------------------------------------------------------------------
   api/axios.js
   INSTANCIA UNICA DO AXIOS usada por todo o sistema.

   Toda chamada HTTP do HubBCC passa por aqui. Isso permite configurar em um
   unico lugar: URL base, timeout, token de autenticacao e tratamento de erro.

   >>> COMO LIGAR O BACKEND REAL (quando existir) <<<
   1) Crie um arquivo ".env" na pasta frontend com:
        VITE_API_URL=http://localhost:8080/api
        VITE_USAR_MOCK=false
   2) Pronto. Com VITE_USAR_MOCK=false o mock nao e ativado e o axios passa a
      falar com o servidor de verdade. Nenhuma tela precisa ser alterada,
      porque todas elas conversam com src/service/*, e nao com o axios direto.
--------------------------------------------------------------------------- */

import axios from "axios";

// Le as variaveis de ambiente do Vite (tudo que comeca com VITE_).
// Se nao existirem, usamos valores padrao voltados para o modo mock.
const URL_BASE = import.meta.env.VITE_API_URL ?? "/api";
const USAR_MOCK = import.meta.env.VITE_USAR_MOCK !== "false";

// Instancia configurada do axios.
export const api = axios.create({
  baseURL: URL_BASE,
  timeout: 10000, // 10s: se o servidor nao responder, a promessa e rejeitada
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------------------------
   INTERCEPTOR DE REQUISICAO
   Roda ANTES de cada chamada sair do navegador. Usamos para anexar o token
   do usuario logado no cabecalho Authorization.
------------------------------------------------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hubbcc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------------------------------------------------------------
   INTERCEPTOR DE RESPOSTA
   Roda DEPOIS que o servidor responde. Usamos para:
   - devolver um erro com mensagem amigavel (em vez do objeto cru do axios);
   - deslogar automaticamente quando o token expira (HTTP 401).
------------------------------------------------------------------------- */
api.interceptors.response.use(
  // Caso de sucesso: nao mexemos em nada, so repassamos a resposta.
  (resposta) => resposta,

  // Caso de erro:
  (erro) => {
    const status = erro.response?.status;

    // 401 = nao autenticado. Limpamos a sessao e mandamos para o login.
    if (status === 401) {
      localStorage.removeItem("hubbcc_token");
      localStorage.removeItem("hubbcc_usuario");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    // Mensagem amigavel: prioriza a mensagem enviada pelo servidor.
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.message ||
      (status === 403 ? "Voce nao tem permissao para esta acao." : null) ||
      (status === 404 ? "Registro nao encontrado." : null) ||
      "Nao foi possivel completar a operacao. Tente novamente.";

    return Promise.reject(new Error(mensagem));
  }
);

/* -------------------------------------------------------------------------
   ATIVACAO DO MOCK
   Só entra em acao no modo mock. O import dinamico garante que o codigo do
   mock nem sequer entra no build de producao quando VITE_USAR_MOCK=false.
------------------------------------------------------------------------- */
if (USAR_MOCK) {
  const { ativarMock } = await import("./mockAdapter.js");
  ativarMock(api);
  console.info("[HubBCC] Modo MOCK ativo — os dados vem de src/mocks/db.js");
}

export default api;
