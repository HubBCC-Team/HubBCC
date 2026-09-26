const VARIANTES = {
  erro: "border-red-200 bg-red-50 text-erro",
  sucesso: "border-green-200 bg-green-50 text-sucesso",
  aviso: "border-amber-200 bg-amber-50 text-alerta",
};

export default function Alerta({
  variante = "erro",
  children,
  className = "",
}) {
  const classes = [
    "rounded-lg border px-3 py-2 text-xs",
    VARIANTES[variante] ?? VARIANTES.erro,
    className,
  ].join(" ");

  return (
    <div className={classes} role="alert">
      {children}
    </div>
  );
}
