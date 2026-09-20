// -----------------------------------------------------------------------------
// vite.config.js
// Configuracao do Vite (servidor de desenvolvimento + build de producao).
// -----------------------------------------------------------------------------
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  // Plugins: React (JSX + fast refresh) e Tailwind v4 (le o @import do index.css).
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Permite importar usando "@/..." em vez de "../../../".
      // Ex.: import Botao from "@/components/ui/Botao";
      "@": path.resolve(new URL(".", import.meta.url).pathname, "src"),
    },
  },

  server: {
    port: 5173,
    open: true, // abre o navegador sozinho ao rodar "npm run dev"
  },
});
