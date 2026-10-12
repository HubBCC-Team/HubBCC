/* ---------------------------------------------------------------------------
   main.jsx
   PONTO DE ENTRADA da aplicacao.

   O que acontece aqui:
   1) importamos os estilos globais (index.css, que carrega o Tailwind);
   2) envolvemos o <App /> com o QueryClientProvider do TanStack Query, que
      deixa o cache de requisicoes disponivel em todas as telas;
   3) em desenvolvimento, mostramos o React Query Devtools (canto da tela)
      para inspecionar as queries;
   4) montamos tudo dentro da div#root do index.html.

   O mock antigo (axios-mock-adapter) foi removido: os dados agora vem do
   JSON Server. Rode "npm run dev:all" para subir API + front.
--------------------------------------------------------------------------- */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
