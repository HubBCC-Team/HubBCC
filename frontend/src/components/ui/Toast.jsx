/* ---------------------------------------------------------------------------
   components/ui/Toast.jsx
   COMPONENTE VISUAL DA NOTIFICACAO (TOAST).

   Este e o cartao flutuante que aparece no canto da tela.
   Ele recebe a mensagem, o tipo (sucesso, erro, info) e uma funcao
   para fechar. A animacao de entrada/saida e feita via classes do Tailwind.
--------------------------------------------------------------------------- */
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function Toast({ mensagem, tipo = "sucesso", aoFechar }) {
  const [visivel, setVisivel] = useState(false);

  // Dispara a animacao de deslizar 10ms apos o componente nascer na tela
  useEffect(() => {
    const timer = setTimeout(() => setVisivel(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Dicionario de estilos e icones para cada tipo de alerta
  const configuracoes = {
    sucesso: {
      icone: <CheckCircle2 className="text-emerald-500" size={20} />,
      fundo: "bg-emerald-50 border-emerald-200 text-emerald-900",
    },
    erro: {
      icone: <XCircle className="text-red-500" size={20} />,
      fundo: "bg-red-50 border-red-200 text-red-900",
    },
    info: {
      icone: <Info className="text-blue-500" size={20} />,
      fundo: "bg-blue-50 border-blue-200 text-blue-900",
    },
  };

  const config = configuracoes[tipo] || configuracoes.info;

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-out ${
        config.fundo
      } ${visivel ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className="shrink-0 pt-0.5">{config.icone}</div>
      <p className="flex-1 text-sm font-medium">{mensagem}</p>
      <button
        onClick={aoFechar}
        className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="Fechar notificacao"
      >
        <X size={16} />
      </button>
    </div>
  );
}
