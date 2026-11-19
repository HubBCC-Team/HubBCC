/* ---------------------------------------------------------------------------
   api/axios.js
   INSTANCIA UNICA DO AXIOS usada por todo o sistema.

   - anexa o access token nas requisicoes;
   - tenta renovar automaticamente quando recebe 401;
   - salva os novos tokens;
   - repete a requisicao original;
   - se o refresh falhar, encerra a sessao.
--------------------------------------------------------------------------- */

import axios from "axios";

const URL_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3001";

export const api = axios.create({
  baseURL: URL_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------- INTERCEPTOR DE REQUEST ------------------------ */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    "hubbcc_token",
  );

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

/* ------------------------- CONTROLE DO REFRESH -------------------------- */

let refreshEmAndamento = null;

async function renovarSessao() {
  const refreshToken =
    localStorage.getItem(
      "hubbcc_refresh_token",
    );

  if (!refreshToken) {
    throw new Error(
      "Refresh token nao encontrado.",
    );
  }

  if (!refreshEmAndamento) {
    refreshEmAndamento = axios
      .post(
        `${URL_BASE}/auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      )
      .then(({ data }) => {
        localStorage.setItem(
          "hubbcc_token",
          data.token,
        );

        localStorage.setItem(
          "hubbcc_refresh_token",
          data.refreshToken,
        );

        return data.token;
      })
      .finally(() => {
        refreshEmAndamento = null;
      });
  }

  return refreshEmAndamento;
}

function limparSessao() {
  localStorage.removeItem(
    "hubbcc_token",
  );

  localStorage.removeItem(
    "hubbcc_refresh_token",
  );

  localStorage.removeItem(
    "hubbcc_usuario",
  );
}

/* ------------------------ INTERCEPTOR DE RESPONSE ----------------------- */

api.interceptors.response.use(
  (resposta) => resposta,

  async (erro) => {
    const status =
      erro.response?.status;

    const requisicaoOriginal =
      erro.config;

    const url =
      requisicaoOriginal?.url ?? "";

    const rotaDeAuth =
      url.includes("/auth/login") ||
      url.includes("/auth/cadastro") ||
      url.includes("/auth/refresh");

    const podeTentarRefresh =
      status === 401 &&
      !rotaDeAuth &&
      !requisicaoOriginal?._retry;

    if (podeTentarRefresh) {
      requisicaoOriginal._retry = true;

      try {
        const novoToken =
          await renovarSessao();

        requisicaoOriginal.headers =
          requisicaoOriginal.headers ?? {};

        requisicaoOriginal.headers.Authorization =
          `Bearer ${novoToken}`;

        return api(
          requisicaoOriginal,
        );
      } catch {
        limparSessao();

        if (
          !window.location.pathname
            .startsWith("/login")
        ) {
          window.location.href =
            "/login";
        }

        return Promise.reject(
          new Error(
            "Sua sessao expirou. Entre novamente.",
          ),
        );
      }
    }

    if (
      status === 401 &&
      !rotaDeAuth
    ) {
      limparSessao();

      if (
        !window.location.pathname
          .startsWith("/login")
      ) {
        window.location.href =
          "/login";
      }
    }

    if (!erro.response) {
      return Promise.reject(
        new Error(
          "Nao foi possivel conectar ao servidor. Verifique se a API esta rodando.",
        ),
      );
    }

    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.message ||
      (status === 403
        ? "Voce nao tem permissao para esta acao."
        : null) ||
      (status === 404
        ? "Registro nao encontrado."
        : null) ||
      "Nao foi possivel completar a operacao. Tente novamente.";

    return Promise.reject(
      new Error(mensagem),
    );
  },
);

export default api;