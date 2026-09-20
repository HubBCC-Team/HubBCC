/* ---------------------------------------------------------------------------
   pages/apoio/DetalheMonitoria.jsx
   TELA 13 — Detalhe da monitoria/tutoria ("/app/apoio/:id").

   Mostra a descricao, os horarios da semana, as avaliacoes recebidas e o
   botao que leva para a tela de agendamento.
--------------------------------------------------------------------------- */
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Wallet, BookOpen } from "lucide-react";
import { useRequisicao } from "../../hooks/useRequisicao";
import { buscarOferta } from "../../service/apoioService";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import Avatar from "../../components/ui/Avatar";
import Estrelas from "../../components/ui/Estrelas";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarValor } from "../../utils/formatadores";

// Avaliacoes ilustrativas. Quando houver backend, troque por uma chamada real.
const AVALIACOES_EXEMPLO = [
  { id: 1, autor: "Lucas F.", nota: 5, texto: "Explicou passo a passo, muito didatico." },
  { id: 2, autor: "Paula R.", nota: 4, texto: "Otimo atendimento, so faltou tempo." },
];

export default function DetalheMonitoria() {
  const { id } = useParams();
  const navegar = useNavigate();

  const { dados: oferta, carregando, erro, recarregar } = useRequisicao(
    () => buscarOferta(id),
    [id],
    null
  );

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!oferta) return null;

  const vagasRestantes = oferta.vagas - oferta.vagasOcupadas;

  return (
    <>
      <button
        onClick={() => navegar(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-marca-700"
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Cabecalho da oferta */}
          <div className="cartao p-6">
            <div className="flex flex-wrap items-start gap-4">
              <Avatar iniciais={oferta.iniciais} tamanho="grande" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap gap-2">
                  <Selo tom="marca">{oferta.tipo}</Selo>
                  <Selo>{oferta.modalidade}</Selo>
                  {oferta.gratuita && <Selo tom="sucesso">Gratuita</Selo>}
                </div>
                <h1 className="text-lg font-semibold text-slate-900">{oferta.titulo}</h1>
                <p className="text-xs text-slate-500">
                  {oferta.disciplina} · com {oferta.monitor}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Estrelas nota={oferta.nota} mostrarNumero />
                  <span className="text-[11px] text-slate-400">
                    {oferta.totalAvaliacoes} avaliacoes
                  </span>
                </div>
              </div>
            </div>

            <h2 className="titulo-secao mt-6">Sobre o atendimento</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{oferta.descricao}</p>
            <p className="mt-2 text-sm text-slate-600">
              <strong className="text-slate-800">Assuntos:</strong> {oferta.assunto}
            </p>
          </div>

          {/* Horarios da semana */}
          <div className="cartao p-6">
            <h2 className="titulo-secao mb-3">Horarios disponiveis</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {oferta.horarios.map((horario) => (
                <div
                  key={horario.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                >
                  <span className="text-xs font-medium text-slate-800">{horario.dia}</span>
                  <span className="text-xs text-slate-500">
                    {horario.inicio} - {horario.fim}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Avaliacoes */}
          <div className="cartao p-6">
            <h2 className="titulo-secao mb-3">Avaliacoes recentes</h2>
            <ul className="space-y-3">
              {AVALIACOES_EXEMPLO.map((avaliacao) => (
                <li key={avaliacao.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">{avaliacao.autor}</span>
                    <Estrelas nota={avaliacao.nota} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600">{avaliacao.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coluna lateral com o resumo e o botao de agendar */}
        <aside className="cartao h-fit p-5">
          <h2 className="titulo-secao mb-3">Resumo</h2>
          <dl className="space-y-3 text-xs">
            <Linha icone={BookOpen} rotulo="Disciplina" valor={oferta.disciplina} />
            <Linha icone={MapPin} rotulo="Local" valor={oferta.local} />
            <Linha icone={Users} rotulo="Vagas livres" valor={`${vagasRestantes} de ${oferta.vagas}`} />
            <Linha icone={Wallet} rotulo="Valor" valor={formatarValor(oferta.valor)} />
          </dl>

          {vagasRestantes > 0 ? (
            <Botao as={Link} to={`/app/apoio/${oferta.id}/agendar`} larguraTotal className="mt-5">
              Agendar horario
            </Botao>
          ) : (
            <Botao larguraTotal className="mt-5" disabled>
              Sem vagas disponiveis
            </Botao>
          )}
        </aside>
      </div>
    </>
  );
}

function Linha({ icone: Icone, rotulo, valor }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icone size={14} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <dt className="text-[11px] text-slate-500">{rotulo}</dt>
        <dd className="font-medium text-slate-800">{valor}</dd>
      </div>
    </div>
  );
}
