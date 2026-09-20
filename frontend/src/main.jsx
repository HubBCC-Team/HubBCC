/* ---------------------------------------------------------------------------
   main.jsx
   PONTO DE ENTRADA da aplicacao.

   O que acontece aqui:
   1) importamos os estilos globais (index.css, que carrega o Tailwind);
   2) importamos o axios para que o MOCK seja ativado logo no inicio;
   3) montamos o <App /> dentro da div#root do index.html.

   StrictMode e uma ferramenta de desenvolvimento do React: ele executa alguns
   trechos duas vezes para ajudar a encontrar erros. Isso NAO acontece no build
   de producao. Se voce ver uma requisicao duplicada no console, e por isso.
--------------------------------------------------------------------------- */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./api/axios";  // ativa o servidor falso antes de qualquer tela carregar
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
