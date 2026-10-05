/* ---------------------------------------------------------------------------
   contexts/ToastContext.jsx
   GERENCIADOR GLOBAL DE NOTIFICACOES (TOASTS).

   Funciona como o AuthContext, mas para as mensagens visuais.
   Mantem uma fila de toasts ativos e renderiza todos eles no canto
   inferior direito. Tambem cuida de remover cada um apos 4 segundos.

   COMO USAR NAS TELAS:
   1) importe o hook: import { useToast } from "../../contexts/useToast";
   2) inicie a variavel: const toast = useToast();
   3) chame a funcao: toast.sucesso("Feito!"); ou toast.erro("Falhou!");
--------------------------------------------------------------------------- */
import { createContext, useState, useCallback } from "react";
import Toast from "../components/ui/Toast";

export const ToastContext = createContext({});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Funcao principal que adiciona um novo toast na fila
  const adicionarToast = useCallback((mensagem, tipo = "sucesso") => {
    const id = Date.now() + Math.random();

    setToasts((atuais) => [...atuais, { id, mensagem, tipo }]);

    // Remove automaticamente apos 4 segundos (4000 ms)
    setTimeout(() => {
      removerToast(id);
    }, 4000);
  }, []);

  // Remove um toast especifico da fila pelo ID
  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
  }, []);

  // Objeto exposto para as telas do aplicativo usarem
  const toast = {
    sucesso: (msg) => adicionarToast(msg, "sucesso"),
    erro: (msg) => adicionarToast(msg, "erro"),
    info: (msg) => adicionarToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {/* Renderiza o aplicativo normal (rotas, telas, etc) */}
      {children}

      {/* "Berco" fixo onde os toasts aparecem (canto inferior direito) */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            mensagem={t.mensagem}
            tipo={t.tipo}
            aoFechar={() => removerToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
