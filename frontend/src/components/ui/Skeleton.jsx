/* ---------------------------------------------------------------------------
   components/ui/Skeleton.jsx
   COMPONENTE DE CARREGAMENTO (SKELETON SCREEN).

   Mostra silhuetas cinzas pulsantes enquanto os dados carregam.
   Variantes: "texto" (padrao), "cartao", "linhaTabela".
--------------------------------------------------------------------------- */

export default function Skeleton({
  variante = "texto",
  className = "",
  linhas = 1,
}) {
  const base = "animate-pulse bg-slate-200 rounded-md";

  const Elemento = () => {
    if (variante === "cartao") {
      return <div className={`${base} h-32 w-full ${className}`} />;
    }
    if (variante === "linhaTabela") {
      return <div className={`${base} h-12 w-full ${className}`} />;
    }
    // Padrao: texto
    return <div className={`${base} h-4 w-full ${className}`} />;
  };

  if (linhas === 1) return <Elemento />;

  // Se pedir varias linhas, devolve uma lista delas com espacamento
  return (
    <div className="flex w-full flex-col gap-3">
      {Array.from({ length: linhas }).map((_, i) => (
        <Elemento key={i} />
      ))}
    </div>
  );
}
