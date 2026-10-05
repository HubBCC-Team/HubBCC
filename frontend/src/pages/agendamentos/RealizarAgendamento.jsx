/* ---------------------------------------------------------------------------
   pages/agendamentos/RealizarAgendamento.jsx
   TELA 15 — Realizar agendamento ("/app/apoio/:id/agendar").
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useRequisicao } from "../../hooks/useRequisicao";
import { buscarOferta } from "../../service/apoioService";
import { realizarAgendamento } from "../../service/agendamentoService";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData, formatarValor } from "../../utils/formatadores";

const NOMES_DIA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const NOMES_DIA_COMPLETO = [
  "Domingo",
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];
const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function gerarDiasDoMes(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [];
  for (let i = 0; i < primeiroDia; i++) celulas.push(null);
  for (let dia = 1; dia <= totalDias; dia++)
    celulas.push(new Date(ano, mes, dia));
  return celulas;
}

export default function RealizarAgendamento() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const {
    dados: oferta,
    carregando,
    erro,
  } = useRequisicao(() => buscarOferta(id), [id], null);

  const [referencia, setReferencia] = useState(() => new Date());
  const [diaEscolhido, setDiaEscolhido] = useState(null);
  const [horaEscolhida, setHoraEscolhida] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} />;
  if (!oferta) return null;

  const ano = referencia.getFullYear();
  const mes = referencia.getMonth();
  const celulas = gerarDiasDoMes(ano, mes);
  const diasAtendidos = oferta.horarios.map((h) => h.dia);
  const horariosDoDia = diaEscolhido
    ? oferta.horarios.filter(
        (h) => h.dia === NOMES_DIA_COMPLETO[diaEscolhido.getDay()],
      )
    : [];

  function diaSelecionavel(data) {
    if (!data) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (data < hoje) return false;
    return diasAtendidos.includes(NOMES_DIA_COMPLETO[data.getDay()]);
  }

  function mudarMes(passo) {
    setReferencia(new Date(ano, mes + passo, 1));
    setDiaEscolhido(null);
    setHoraEscolhida(null);
  }

  async function aoConfirmar() {
    setEnviando(true);
    try {
      await realizarAgendamento({
        usuarioId: usuario.id,
        ofertaId: oferta.id,
        data: diaEscolhido.toISOString().slice(0, 10),
        hora: horaEscolhida,
      });
      toast.sucesso("Agendamento confirmado!");
      navegar("/app/agendamentos");
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho titulo="Realizar agendamento" subtitulo={oferta.titulo} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* --------------------------- Calendario --------------------------- */}
        <div className="cartao p-4 sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="titulo-secao">
              {NOMES_MES[mes]} de {ano}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => mudarMes(-1)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => mudarMes(1)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Ajuste mobile: Fonte menor para os dias da semana */}
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-medium text-slate-500">
            {NOMES_DIA_CURTO.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {celulas.map((data, indice) => {
              if (!data) return <span key={`vazio-${indice}`} />;
              const habilitado = diaSelecionavel(data);
              const selecionado =
                diaEscolhido &&
                data.toDateString() === diaEscolhido.toDateString();

              return (
                <button
                  key={data.toISOString()}
                  type="button"
                  disabled={!habilitado}
                  onClick={() => {
                    setDiaEscolhido(data);
                    setHoraEscolhida(null);
                  }}
                  className={[
                    // Ajuste mobile: aspect-square garante o quadrado, padding menor, flex p/ centrar
                    "aspect-square flex items-center justify-center rounded-md sm:rounded-lg text-[11px] sm:text-xs transition",
                    selecionado
                      ? "bg-marca-600 font-medium text-white"
                      : habilitado
                        ? "bg-marca-50 text-marca-700 hover:bg-marca-100"
                        : "text-slate-300",
                  ].join(" ")}
                >
                  {data.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Dias em azul claro possuem atendimento disponivel.
          </p>
        </div>

        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Horarios disponiveis</h2>

            {!diaEscolhido ? (
              <p className="text-xs text-slate-500">
                Escolha primeiro um dia no calendario.
              </p>
            ) : horariosDoDia.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nao ha horarios neste dia.
              </p>
            ) : (
              <div className="space-y-2">
                {horariosDoDia.map((horario) => (
                  <button
                    key={horario.id}
                    type="button"
                    onClick={() => setHoraEscolhida(horario.inicio)}
                    className={[
                      "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-xs transition",
                      horaEscolhida === horario.inicio
                        ? "border-marca-600 bg-marca-50 font-medium text-marca-700"
                        : "border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span>
                      {horario.inicio} - {horario.fim}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {oferta.vagas - oferta.vagasOcupadas} vaga(s)
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Resumo do agendamento</h2>
            <dl className="space-y-2.5 text-xs">
              <Linha
                icone={CalendarDays}
                rotulo="Data"
                valor={
                  diaEscolhido
                    ? formatarData(diaEscolhido.toISOString().slice(0, 10))
                    : "-"
                }
              />
              <Linha
                icone={Clock}
                rotulo="Horario"
                valor={horaEscolhida ?? "-"}
              />
              <Linha icone={MapPin} rotulo="Local" valor={oferta.local} />
            </dl>

            <p className="mt-3 border-t border-slate-100 pt-3 text-xs">
              <span className="text-slate-500">Valor: </span>
              <strong className="text-slate-800">
                {formatarValor(oferta.valor)}
              </strong>
            </p>

            <Botao
              larguraTotal
              className="mt-4"
              disabled={!diaEscolhido || !horaEscolhida}
              carregando={enviando}
              onClick={aoConfirmar}
            >
              Confirmar agendamento
            </Botao>
          </div>
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
