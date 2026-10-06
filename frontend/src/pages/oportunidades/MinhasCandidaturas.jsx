/* ---------------------------------------------------------------------------
   pages/oportunidades/MinhasCandidaturas.jsx
   TELA 11 - Minhas candidaturas (rota "/app/candidaturas").
   Casos de uso 7 (consultar) e cancelamento de candidatura.

   TANSTACK QUERY:
   - useCandidaturas(usuarioId, filtros) -> lista (a aba faz parte da chave)
   - useCancelarCandidatura()            -> cancela e invalida a lista
   Mostra os dados em TABELA no desktop e em CARTOES no mobile.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useCandidaturas, useCancelarCandidatura } from "../../queries";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { SeloSituacao } from "../../components/ui/Selo";
import { Erro, Vazio } from "../../components/ui/Estado";
import Skeleton from "../../components/ui/Skeleton";
import { formatarData } from "../../utils/formatadores";

const ABAS = ["Todas", "Em analise", "Aprovada", "Reprovada"];

export default function MinhasCandidaturas() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [aba, setAba] = useState("Todas");

  const filtros = aba === "Todas" ? {} : { situacao: aba };
  const { data: lista = [], isLoading, isError, error, refetch } = useCandidaturas(usuario?.id, filtros);
  const cancelar = useCancelarCandidatura();

  function aoCancelar(id) {
    if (!confirm("Deseja cancelar esta candidatura?")) return;
    cancelar.mutate(id, {
      onSuccess: () => toast.sucesso("Candidatura cancelada com sucesso!"),
      onError: (e) => toast.erro(e.message || "Erro ao cancelar a candidatura."),
    });
  }

  // Botao de lixeira: mostra spinner so na linha que esta sendo cancelada.
  // (funcao comum, e nao componente, para nao ser recriado a cada render)
  function botaoCancelar(item, className = "") {
    const cancelandoEste = cancelar.isPending && cancelar.variables === item.id;
    return (
      <button
        type="button"
        onClick={() => aoCancelar(item.id)}
        disabled={cancelar.isPending}
        className={`text-slate-400 transition hover:text-erro disabled:opacity-50 ${className}`}
        aria-label="Cancelar candidatura"
      >
        {cancelandoEste ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    );
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
        {isLoading ? (
          <div className="p-4">
            <Skeleton variante="linhaTabela" linhas={4} />
          </div>
        ) : isError ? (
          <Erro mensagem={error.message} aoTentarNovamente={refetch} />
        ) : lista.length === 0 ? (
          <Vazio
            titulo="Nenhuma candidatura encontrada"
            descricao="Assim que voce se candidatar a uma oportunidade, ela aparece aqui."
          />
        ) : (
          <>
            {/* VISAO DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
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
                        {item.situacao === "Em analise" && botaoCancelar(item)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VISAO MOBILE */}
            <div className="flex flex-col divide-y divide-slate-100 md:hidden">
              {lista.map((item) => (
                <div key={item.id} className="p-4 transition hover:bg-slate-50/60">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <Link
                      to={`/app/oportunidades/${item.oportunidadeId}`}
                      className="min-w-0 flex-1 font-medium text-slate-800 hover:text-marca-700"
                    >
                      <h3 className="truncate">{item.oportunidadeTitulo}</h3>
                    </Link>
                    <SeloSituacao situacao={item.situacao} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>{item.tipo}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{formatarData(item.dataEnvio)}</span>
                    </div>
                    {item.situacao === "Em analise" && botaoCancelar(item, "p-1")}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
