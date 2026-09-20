/* ---------------------------------------------------------------------------
   components/ui/Estrelas.jsx
   Avaliacao por estrelas.

   - Somente leitura:  <Estrelas nota={4.8} />
   - Clicavel:         <Estrelas nota={nota} aoSelecionar={setNota} tamanho={28} />
     (basta passar "aoSelecionar" para o componente virar interativo)
--------------------------------------------------------------------------- */
import { Star } from "lucide-react";

export default function Estrelas({ nota = 0, aoSelecionar, tamanho = 14, mostrarNumero = false }) {
  const interativo = typeof aoSelecionar === "function";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((posicao) => (
        <Star
          key={posicao}
          size={tamanho}
          // Preenche a estrela se a nota for maior ou igual a posicao dela.
          className={
            posicao <= Math.round(nota)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }
          onClick={interativo ? () => aoSelecionar(posicao) : undefined}
          style={interativo ? { cursor: "pointer" } : undefined}
        />
      ))}
      {mostrarNumero && <span className="ml-1 text-xs text-slate-500">{Number(nota).toFixed(1)}</span>}
    </div>
  );
}
