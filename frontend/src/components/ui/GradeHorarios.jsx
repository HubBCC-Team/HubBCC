/* ---------------------------------------------------------------------------
   components/ui/GradeHorarios.jsx
   Grade semanal de horarios, reaproveitada por CriarOferta e EditarOferta.

   E so a parte visual: recebe "horarios" (array com os itens ja marcados,
   cada um { id, dia, inicio, fim }) e "aoAlterar(dia, faixa)", chamado
   quando o usuario clica em uma celula. Quem decide COMO adicionar/remover
   do array e o componente pai (a logica de marcar/desmarcar continua la).
--------------------------------------------------------------------------- */
const DIAS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta"];
const FAIXAS = ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"];

export default function GradeHorarios({ horarios, aoAlterar }) {
  return (
    <div className="cartao p-6">
      <h2 className="titulo-secao">Disponibilidade semanal</h2>
      <p className="mb-4 mt-1 text-[11px] text-slate-500">
        Clique nos horarios em que voce pode atender. Cada bloco dura 2 horas.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-center text-[11px]">
          <thead>
            <tr>
              <th className="w-16" />
              {DIAS.map((dia) => (
                <th key={dia} className="pb-2 font-medium text-slate-600">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FAIXAS.map((faixa) => (
              <tr key={faixa}>
                <td className="pr-2 text-right text-slate-500">{faixa}</td>
                {DIAS.map((dia) => {
                  const selecionado = horarios.some((h) => h.id === `${dia}-${faixa}`);
                  return (
                    <td key={dia} className="p-1">
                      <button
                        type="button"
                        onClick={() => aoAlterar(dia, faixa)}
                        className={[
                          "h-8 w-full rounded-md border transition",
                          selecionado
                            ? "border-marca-600 bg-marca-600 text-white"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                        aria-label={`${dia} as ${faixa}`}
                      >
                        {selecionado ? "✓" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
