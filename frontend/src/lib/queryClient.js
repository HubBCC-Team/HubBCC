/* ---------------------------------------------------------------------------
   lib/queryClient.js
   CLIENTE DO TANSTACK QUERY (unico para toda a aplicacao).

   Ele guarda em cache as respostas das requisicoes e controla carregando,
   erro, nova tentativa e atualizacao dos dados. Substitui o controle manual
   que era feito pelo hook useRequisicao.
--------------------------------------------------------------------------- */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,           // dado considerado "fresco" por 30s
      retry: 1,                    // tenta de novo 1 vez se falhar
      refetchOnWindowFocus: false, // nao recarrega so por trocar de aba
    },
    mutations: {
      retry: 0, // cadastros/alteracoes nunca sao repetidos automaticamente
    },
  },
});
