import { useParams, useNavigate } from "react-router-dom";
import {
  useOportunidade,
  useCandidaturas,
  useAvaliarCandidatura,
} from "../../queries";
import { useToast } from "../../contexts/useToast";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { SeloSituacao } from "../../components/ui/Selo";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

export default function AvaliarCandidaturas() {
  const { id } = useParams();
  const navegar = useNavigate();
  const toast = useToast();

  const oportunidade = useOportunidade(id);

  const candidaturas = useCandidaturas(null, {
    oportunidadeId: Number(id),
    _expand: "usuario",
  });

  const avaliar = useAvaliarCandidatura();

  function aoAvaliar(candidaturaId, situacao) {
    avaliar.mutate(
      { id: candidaturaId, situacao },
      {
        onSuccess: () =>
          toast.sucesso(
            situacao === "Aprovada"
              ? "Candidatura aprovada!"
              : "Candidatura reprovada!",
          ),
        onError: (e) =>
          toast.erro(e.message || "Erro ao avaliar candidatura."),
      },
    );
  }

  if (oportunidade.isLoading || candidaturas.isLoading) {
    return <Carregando />;
  }

  if (oportunidade.isError) {
    return (
      <Erro
        mensagem={oportunidade.error.message}
        aoTentarNovamente={oportunidade.refetch}
      />
    );
  }

  if (candidaturas.isError) {
    return (
      <Erro
        mensagem={candidaturas.error.message}
        aoTentarNovamente={candidaturas.refetch}
      />
    );
  }

  const lista = candidaturas.data ?? [];

  return (
    <>
      <Cabecalho
        titulo="Avaliar candidaturas"
        subtitulo={oportunidade.data?.titulo}
      >
        <Botao variante="contorno" onClick={() => navegar(-1)}>
          Voltar
        </Botao>
      </Cabecalho>

      {lista.length === 0 ? (
        <Vazio
          titulo="Nenhuma candidatura encontrada"
          descricao="Ainda não existem candidaturas para esta oportunidade."
        />
      ) : (
        <div className="space-y-4">
          {lista.map((item) => (
            <div key={item.id} className="cartao p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {item.usuario?.nome ?? `Aluno #${item.usuarioId}`}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Enviada em {formatarData(item.dataEnvio)}
                  </p>
                </div>

                <SeloSituacao situacao={item.situacao} />
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-slate-700">
                  Carta de motivação
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.carta || "Nenhuma carta informada."}
                </p>
              </div>

              {item.situacao === "Em analise" && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <Botao
                    onClick={() => aoAvaliar(item.id, "Aprovada")}
                    carregando={
                      avaliar.isPending &&
                      avaliar.variables?.id === item.id &&
                      avaliar.variables?.situacao === "Aprovada"
                    }
                  >
                    Aprovar
                  </Botao>

                  <Botao
                    variante="perigo"
                    onClick={() => aoAvaliar(item.id, "Reprovada")}
                    carregando={
                      avaliar.isPending &&
                      avaliar.variables?.id === item.id &&
                      avaliar.variables?.situacao === "Reprovada"
                    }
                  >
                    Reprovar
                  </Botao>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
