/* ---------------------------------------------------------------------------
   pages/agendamentos/RegistrarAtendimento.jsx
   TELA 18 — Registrar atendimento ("/app/agendamentos/:id/registrar").

   Caso de uso 17 (prioridade 9 — Mina). Quem registra e o monitor, ao final
   da sessao: informa se o aluno compareceu, a duracao e observacoes.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, X, CalendarDays, Clock, MapPin } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarAgendamentos, registrarAtendimento } from "../../service/agendamentoService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

export default function RegistrarAtendimento() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();

  // Nao existe endpoint "buscar agendamento por id" no mock, entao trazemos
  // a lista do usuario e filtramos aqui mesmo.
  const { dados: lista, carregando, erro } = useRequisicao(
    () => listarAgendamentos(usuario.id),
    [usuario.id],
    []
  );

  const [compareceu, setCompareceu] = useState(true);
  const [duracao, setDuracao] = useState(60);
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} />;

  const agendamento = lista.find((a) => a.id === Number(id));
  if (!agendamento) return <Erro mensagem="Agendamento nao encontrado." />;

  async function aoSalvar() {
    setErroEnvio(null);
    setEnviando(true);
    try {
      await registrarAtendimento(agendamento.id, {
        compareceu,
        duracao: Number(duracao),
        observacoes,
      });
      navegar("/app/agendamentos");
    } catch (e) {
      setErroEnvio(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Registrar atendimento"
        subtitulo="Informe como foi a sessao para concluir o agendamento"
      />

      {erroEnvio && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erroEnvio}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cartao space-y-5 p-6 lg:col-span-2">
          <h2 className="titulo-secao">Registro da sessao</h2>

          {/* Botoes sim/nao para presenca */}
          <div>
            <p className="rotulo">O aluno compareceu?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCompareceu(true)}
                className={[
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition",
                  compareceu
                    ? "border-sucesso bg-green-50 text-sucesso"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <Check size={14} /> Sim
              </button>
              <button
                type="button"
                onClick={() => setCompareceu(false)}
                className={[
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition",
                  !compareceu
                    ? "border-erro bg-red-50 text-erro"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <X size={14} /> Nao
              </button>
            </div>
          </div>

          <Campo
            rotulo="Duracao do atendimento (minutos)"
            type="number"
            min="0"
            step="15"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
          />

          <CampoTexto
            rotulo="Observacoes"
            linhas={5}
            placeholder="Conteudos trabalhados, dificuldades observadas, proximos passos..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Botao variante="contorno" onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
            <Botao carregando={enviando} onClick={aoSalvar}>
              Registrar sessao
            </Botao>
          </div>
        </div>

        {/* Resumo do agendamento */}
        <aside className="cartao h-fit p-5">
          <h2 className="titulo-secao mb-3">Agendamento</h2>
          <p className="text-sm font-semibold text-slate-900">{agendamento.titulo}</p>
          <p className="text-[11px] text-slate-500">{agendamento.disciplina}</p>

          <dl className="mt-4 space-y-2.5 text-xs">
            <Linha icone={CalendarDays} rotulo="Data" valor={formatarData(agendamento.data)} />
            <Linha icone={Clock} rotulo="Horario" valor={agendamento.hora} />
            <Linha icone={MapPin} rotulo="Local" valor={agendamento.local} />
          </dl>
        </aside>
      </div>
    </>
  );
}

function Linha({ icone: Icone, rotulo, valor }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icone size={14} className="shrink-0 text-slate-400" />
      <div>
        <dt className="text-[11px] text-slate-500">{rotulo}</dt>
        <dd className="font-medium text-slate-800">{valor}</dd>
      </div>
    </div>
  );
}
