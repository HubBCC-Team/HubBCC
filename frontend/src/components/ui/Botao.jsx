/* ---------------------------------------------------------------------------
   components/ui/Botao.jsx
   Botao padrao do HubBCC.

   PROPS:
   - variante : "primario" | "secundario" | "contorno" | "perigo" | "texto"
   - tamanho  : "pequeno" | "medio" | "grande"
   - larguraTotal : ocupa 100% da largura disponivel
   - carregando   : mostra "Aguarde..." e desabilita o botao
   - as       : muda a tag renderizada (ex.: as={Link} para virar link)

   EXEMPLO:
     <Botao variante="primario" onClick={salvar}>Salvar</Botao>
     <Botao as={Link} to="/login" variante="contorno">Entrar</Botao>
--------------------------------------------------------------------------- */

// Estilos de cada variante. Para criar uma nova, basta adicionar uma linha.
const VARIANTES = {
  primario: "bg-marca-600 text-white hover:bg-marca-700 shadow-sm",
  secundario: "bg-marca-50 text-marca-700 hover:bg-marca-100",
  contorno: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  perigo: "bg-white text-erro border border-red-200 hover:bg-red-50",
  texto: "text-marca-700 hover:bg-marca-50",
};

const TAMANHOS = {
  pequeno: "px-3 py-1.5 text-xs",
  medio: "px-4 py-2 text-sm",
  grande: "px-5 py-2.5 text-sm",
};

export default function Botao({
  variante = "primario",
  tamanho = "medio",
  larguraTotal = false,
  carregando = false,
  as: Tag = "button",
  className = "",
  children,
  ...resto
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition",
    "focus:outline-none focus:ring-2 focus:ring-marca-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANTES[variante] ?? VARIANTES.primario,
    TAMANHOS[tamanho] ?? TAMANHOS.medio,
    larguraTotal ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <Tag className={classes} disabled={carregando || resto.disabled} {...resto}>
      {carregando ? "Aguarde..." : children}
    </Tag>
  );
}
