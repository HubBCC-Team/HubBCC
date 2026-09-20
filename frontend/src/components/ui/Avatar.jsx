/* ---------------------------------------------------------------------------
   components/ui/Avatar.jsx
   Circulo com as iniciais da pessoa (substitui a foto de perfil).

   USO: <Avatar iniciais="MM" tamanho="grande" />
--------------------------------------------------------------------------- */

const TAMANHOS = {
  pequeno: "h-8 w-8 text-[11px]",
  medio: "h-10 w-10 text-xs",
  grande: "h-14 w-14 text-base",
};

export default function Avatar({ iniciais = "?", tamanho = "medio", className = "" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-marca-100 font-semibold text-marca-700 ${
        TAMANHOS[tamanho] ?? TAMANHOS.medio
      } ${className}`}
    >
      {iniciais}
    </div>
  );
}
