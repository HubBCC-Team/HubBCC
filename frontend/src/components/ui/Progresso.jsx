/* ---------------------------------------------------------------------------
   components/ui/Progresso.jsx
   Indicadores de progresso das horas complementares.

   - <ProgressoCircular percentual={74} />  -> o anel verde do dashboard
   - <BarraProgresso percentual={74} />     -> barra horizontal simples
--------------------------------------------------------------------------- */

export function ProgressoCircular({ percentual = 0, tamanho = 110, legenda }) {
  // Garante que o valor fique entre 0 e 100 (evita anel quebrado).
  const valor = Math.min(100, Math.max(0, percentual));

  const raio = (tamanho - 12) / 2;
  const circunferencia = 2 * Math.PI * raio;
  // "strokeDashoffset" controla quanto do circulo fica preenchido.
  const preenchimento = circunferencia - (valor / 100) * circunferencia;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        {/* Trilho cinza */}
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progresso verde */}
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={preenchimento}
          className="transition-all duration-700"
        />
        {/* Texto central (rotacionado de volta porque o svg esta -90deg) */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="rotate-90 origin-center fill-slate-900 text-lg font-semibold"
        >
          {valor}%
        </text>
      </svg>
      {legenda && <p className="text-[11px] text-slate-500">{legenda}</p>}
    </div>
  );
}

export function BarraProgresso({ percentual = 0, cor = "bg-marca-600" }) {
  const valor = Math.min(100, Math.max(0, percentual));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={`h-full rounded-full ${cor} transition-all duration-700`} style={{ width: `${valor}%` }} />
    </div>
  );
}
