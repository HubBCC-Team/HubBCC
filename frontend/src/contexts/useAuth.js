/* ---------------------------------------------------------------------------
   contexts/useAuth.js
   Atalho para ler o AuthContext.

   Fica em arquivo separado do AuthContext.jsx porque o Fast Refresh do Vite
   reclama quando um mesmo arquivo exporta componente e hook ao mesmo tempo.

   USO:
     const { usuario, autenticado, entrar, sair } = useAuth();
--------------------------------------------------------------------------- */
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const contexto = useContext(AuthContext);

  // Erro claro caso alguem esqueca de envolver a arvore com <AuthProvider>.
  if (!contexto) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  }
  return contexto;
}
