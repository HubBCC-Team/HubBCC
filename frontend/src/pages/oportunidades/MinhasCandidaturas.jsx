/* ---------------------------------------------------------------------------
   pages/oportunidades/MinhasCandidaturas.jsx
   TELA 11 — Minhas candidaturas (rota "/app/candidaturas").

   Casos de uso 7 (consultar) e cancelamento de candidatura.
   Mostra os dados em TABELA, com abas de situacao no topo.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarCandidaturas, cancelarCandidatura } from "../../service/oportunidadeService";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { SeloSituacao } from "../../components/ui/Selo";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

const ABAS = ["Todas", "Em analise", "Aprovada", "Reprovada"];

export default function MinhasCandidaturas() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState("Todas");

  const { dados: lista, carregando, erro, recarregar } = useRequisicao(
    () => listarCandidaturas(usuario.id, aba === "Todas" ? {} : { situacao: aba }),
    [usuario.id, aba],
    []
  );

  // Cancela e recarrega a lista para refletir a exclusao.
  async function aoCancelar(id) {
    if (!confirm("Deseja cancelar esta candidatura?")) return;
    await cancelarCandidatura(id);
    recarregar();
  }

  return (
    <>
      <Cabecalho
        titulo="Minhas Candidaturas"
        subtitulo="Acompanhe a situacao das oportunidades em que voce se inscreveu"
      >
        <Botao as={Link} to="/app/oportunidades" variante="contorno">
          Ver oportunidades
        </Botao>
      </Cabecalho>

      {/* Abas de situacao */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ABAS.map((nome) => (
          <button
            key={nome}
            type="button"
            onClick={() => setAba(nome)}
            className={[
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              aba === nome
                ? "bg-marca-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {nome}
          </button>
        ))}
      </div>

      <div className="cartao overflow-hidden">
        {carregando ? (
          <Carregando />
        ) : erro ? (
          <Erro mensagem={erro} aoTentarNovamente={recarregar} />
        ) : lista.length === 0 ? (
          <Vazio
            titulo="Nenhuma candidatura encontrada"
            descricao="Assim que voce se candidatar a uma oportunidade, ela aparece aqui."
          />
        ) : (
          // overflow-x-auto: em telas pequenas a tabela rola na horizontal
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Oportunidade</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Enviada em</th>
                  <th className="px-5 py-3 font-medium">Situacao</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <Link
                        to={`/app/oportunidades/${item.oportunidadeId}`}
                        className="font-medium text-slate-800 hover:text-marca-700"
                      >
                        {item.oportunidadeTitulo}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{item.tipo}</td>
                    <td className="px-5 py-3 text-slate-500">{formatarData(item.dataEnvio)}</td>
                    <td className="px-5 py-3">
                      <SeloSituacao situacao={item.situacao} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {/* So faz sentido cancelar o que ainda esta em analise */}
                      {item.situacao === "Em analise" && (
                        <button
                          type="button"
                          onClick={() => aoCancelar(item.id)}
                          className="text-slate-400 transition hover:text-erro"
                          aria-label="Cancelar candidatura"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
