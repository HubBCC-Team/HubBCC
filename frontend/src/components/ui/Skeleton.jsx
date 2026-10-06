/* ---------------------------------------------------------------------------
   components/ui/Skeleton.jsx
   Bloco cinza pulsante exibido enquanto os dados carregam.

   PROPS
   - variante: "texto" (padrao) | "cartao" | "linhaTabela"
   - linhas:   quantas copias empilhar (padrao 1)
   - className: classes extras (ex.: "h-44", "w-1/3", "hidden md:block")

   Correcao de lint: antes o bloco era um componente criado DENTRO do render
   (const Elemento = () => ...), o que recria o componente a cada render.
   Agora a altura padrao vem de um objeto fixo e o bloco e um <div> comum.
--------------------------------------------------------------------------- */
const BASE = "animate-pulse rounded-md bg-slate-200";

const ALTURA_PADRAO = {
  texto: "h-4",
  cartao: "h-32",
  linhaTabela: "h-12",
};

export default function Skeleton({ variante = "texto", linhas = 1, className = "" }) {
  const classes = `${BASE} ${ALTURA_PADRAO[variante] ?? ALTURA_PADRAO.texto} w-full ${className}`;

  if (linhas === 1) return <div className={classes} aria-hidden="true" />;

  // Varias linhas: lista com espacamento
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: linhas }, (_, indice) => (
        <div key={indice} className={classes} />
      ))}
    </div>
  );
}
