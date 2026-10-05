/* ---------------------------------------------------------------------------
   contexts/useToast.js
   HOOK FACILITADOR DO TOAST.

   Este arquivo existe apenas para que as telas nao precisem importar
   o useContext e o ToastContext toda vez. Ele ja entrega a ferramenta
   pronta para ser utilizada pelas funcoes de salvar/excluir.
--------------------------------------------------------------------------- */
import { useContext } from "react";
import { ToastContext } from "./ToastContext";

export function useToast() {
  const contexto = useContext(ToastContext);

  // Trava de seguranca caso esquecam de colocar o ToastProvider no App.jsx
  if (!contexto) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider.");
  }

  return contexto;
}
