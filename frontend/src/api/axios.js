/* ---------------------------------------------------------------------------
   api/axios.js
   INSTANCIA UNICA DO AXIOS usada por todo o sistema.

   Toda chamada HTTP do HubBCC passa por aqui. Isso permite configurar em um
   unico lugar: URL base, timeout, token de autenticacao e tratamento de erro.

   >>> BACKEND <<<
   O backend mockado agora e o JSON SERVER (pasta server/ + arquivo db.json).
     npm run server   -> sobe a API em http://localhost:3001
     npm run dev:all  -> sobe API + front juntos
   Para apontar para outro endereco, crie um ".env" com VITE_API_URL=...
   Nenhuma tela precisa ser alterada, porque todas conversam com
   src/service/*, e nao com o axios direto.
--------------------------------------------------------------------------- */
import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const api = axios.create({
  baseURL: URL_BASE,
  timeout: 10000, // 10s: se o servidor nao responder, a promessa e rejeitada
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------------------------
   INTERCEPTOR DE REQUISICAO
   Anexa o token do usuario logado no cabecalho Authorization.
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
   - devolve um erro com mensagem amigavel (em vez do objeto cru do axios);
   - desloga automaticamente quando o token expira (HTTP 401);
   - avisa quando o JSON Server nao esta rodando.
------------------------------------------------------------------------- */
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const status = erro.response?.status;
    const url = erro.config?.url ?? "";

    // 401 fora do login = sessao invalida. No login, 401 e so senha errada.
    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("hubbcc_token");
      localStorage.removeItem("hubbcc_usuario");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    // Sem resposta = servidor fora do ar
    if (!erro.response) {
      return Promise.reject(
        new Error(
          "Nao foi possivel conectar ao servidor. Verifique se o JSON Server esta rodando (npm run server).",
        ),
      );
    }

    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.message ||
      (status === 403 ? "Voce nao tem permissao para esta acao." : null) ||
      (status === 404 ? "Registro nao encontrado." : null) ||
      "Nao foi possivel completar a operacao. Tente novamente.";

    return Promise.reject(new Error(mensagem));
  },
);

export default api;
