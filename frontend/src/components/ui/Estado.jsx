/* ---------------------------------------------------------------------------
   components/ui/Estado.jsx
   Componentes de estado de tela: carregando, erro e lista vazia.

   Use sempre os tres juntos, nesta ordem, em qualquer tela que busca dados:

     if (carregando) return <Carregando />;
     if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
     if (!lista.length) return <Vazio titulo="Nada por aqui" />;
--------------------------------------------------------------------------- */
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import Botao from "./Botao";

export function Carregando({ texto = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 className="animate-spin" size={26} />
      <p className="text-sm">{texto}</p>
    </div>
  );
}

export function Erro({ mensagem, aoTentarNovamente }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertCircle className="text-erro" size={26} />
      <p className="text-sm text-slate-600">{mensagem}</p>
      {aoTentarNovamente && (
        <Botao variante="contorno" tamanho="pequeno" onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}

export function Vazio({ titulo = "Nenhum registro encontrado", descricao, acao }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox className="text-slate-300" size={30} />
      <p className="text-sm font-medium text-slate-700">{titulo}</p>
      {descricao && <p className="max-w-sm text-xs text-slate-500">{descricao}</p>}
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}
