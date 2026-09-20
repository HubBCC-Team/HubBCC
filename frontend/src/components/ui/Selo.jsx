/* ---------------------------------------------------------------------------
   components/ui/Selo.jsx
   "Badge" colorido usado para mostrar situacoes (Aprovada, Em analise...)
   e etiquetas (Remoto, Monitoria, Gratuita).

   USO:
     <Selo tom="sucesso">Aprovada</Selo>
     <Selo>Remoto</Selo>              // tom neutro por padrao
     <SeloSituacao situacao="Em analise" />   // escolhe a cor sozinho
--------------------------------------------------------------------------- */

const TONS = {
  neutro: "bg-slate-100 text-slate-600",
  marca: "bg-marca-50 text-marca-700",
  sucesso: "bg-green-50 text-green-700",
  alerta: "bg-amber-50 text-amber-700",
  erro: "bg-red-50 text-red-700",
};

export default function Selo({ tom = "neutro", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        TONS[tom] ?? TONS.neutro
      } ${className}`}
    >
      {children}
    </span>
  );
}

// Mapa que traduz o texto da situacao para a cor correspondente.
// Para adicionar uma nova situacao, inclua uma linha aqui.
const COR_POR_SITUACAO = {
  Aprovada: "sucesso",
  Confirmado: "sucesso",
  Realizado: "marca",
  Aberta: "sucesso",
  "Em analise": "alerta",
  Pendente: "alerta",
  Reprovada: "erro",
  Recusada: "erro",
  Cancelada: "erro",
  Cancelado: "erro",
  Encerrada: "neutro",
};

export function SeloSituacao({ situacao }) {
  return <Selo tom={COR_POR_SITUACAO[situacao] ?? "neutro"}>{situacao}</Selo>;
}
