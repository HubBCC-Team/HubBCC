/* ---------------------------------------------------------------------------
   pages/agendamentos/RealizarAgendamento.jsx
   TELA 15 - Realizar agendamento ("/app/apoio/:id/agendar"). Caso de uso 14.

   - useOferta(id)          (TanStack Query) busca a oferta e seus horarios.
   - useForm + zodResolver  (React Hook Form + Zod) guarda "data" e "hora".
     O calendario e os botoes de horario nao sao <input>: eles chamam
     setValue(). O schema valida que ha dia e horario e que a data nao e passada.
   - useRealizarAgendamento (useMutation) envia. Erros do servidor (sem vaga,
     conflito de horario) aparecem no <Alerta>.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useOferta, useRealizarAgendamento } from "../../queries";
import { agendamentoSchema } from "../../schemas/agendamentoSchemas";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData, formatarValor } from "../../utils/formatadores";

const NOMES_DIA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const NOMES_DIA_COMPLETO = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
const NOMES_MES = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function gerarDiasDoMes(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [];
  for (let i = 0; i < primeiroDia; i++) celulas.push(null);
  for (let dia = 1; dia <= totalDias; dia++) celulas.push(new Date(ano, mes, dia));
  return celulas;
}

// Date -> "AAAA-MM-DD" usando o dia LOCAL.
// (toISOString converte para UTC e pode cair no dia anterior/seguinte.)
function paraISO(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// "AAAA-MM-DD" -> Date local
function deISO(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export default function RealizarAgendamento() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const { data: oferta, isLoading, isError, error, refetch } = useOferta(id);
  const agendar = useRealizarAgendamento();

  const [referencia, setReferencia] = useState(() => new Date());

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: { data: "", hora: "" },
  });

  const dataEscolhida = useWatch({ control, name: "data" });
  const horaEscolhida = useWatch({ control, name: "hora" });

  if (isLoading) return <Carregando />;
  if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
  if (!oferta) return null;

  const ano = referencia.getFullYear();
  const mes = referencia.getMonth();
  const celulas = gerarDiasDoMes(ano, mes);
  const horarios = oferta.horarios ?? [];
  const diasAtendidos = horarios.map((h) => h.dia);
  const vagasLivres = Math.max(oferta.vagas - (oferta.vagasOcupadas ?? 0), 0);

  const diaEscolhido = dataEscolhida ? deISO(dataEscolhida) : null;
  const horariosDoDia = diaEscolhido
    ? horarios.filter((h) => h.dia === NOMES_DIA_COMPLETO[diaEscolhido.getDay()])
    : [];

  function diaSelecionavel(data) {
    if (!data) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (data < hoje) return false;
    return diasAtendidos.includes(NOMES_DIA_COMPLETO[data.getDay()]);
  }

  // shouldValidate depois da 1a tentativa: as mensagens somem ao corrigir.
  const opcoes = { shouldValidate: isSubmitted, shouldDirty: true };

  function escolherDia(data) {
    setValue("data", paraISO(data), opcoes);
    setValue("hora", "", opcoes);
  }

  function mudarMes(passo) {
    setReferencia(new Date(ano, mes + passo, 1));
    setValue("data", "", opcoes);
    setValue("hora", "", opcoes);
  }

  function aoConfirmar({ data, hora }) {
    agendar.mutate(
      { usuarioId: usuario.id, ofertaId: oferta.id, data, hora },
      {
        onSuccess: () => {
          toast.sucesso("Agendamento confirmado!");
          navegar("/app/agendamentos");
        },
      }
    );
  }

  return (
    <>
      <Cabecalho titulo="Realizar agendamento" subtitulo={oferta.titulo} />

      {agendar.isError && (
        <Alerta variante="erro" className="mb-4">
          {agendar.error.message}
        </Alerta>
      )}

      {vagasLivres === 0 && (
        <Alerta variante="aviso" className="mb-4">
          Esta oferta esta sem vagas no momento.
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoConfirmar)} noValidate className="grid gap-4 lg:grid-cols-3">
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
                aria-label="Mes anterior"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => mudarMes(1)}
                aria-label="Proximo mes"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-medium text-slate-500">
            {NOMES_DIA_CURTO.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {celulas.map((data, indice) => {
              if (!data) return <span key={`vazio-${indice}`} />;
              const habilitado = diaSelecionavel(data);
              const selecionado = dataEscolhida === paraISO(data);
              return (
                <button
                  key={paraISO(data)}
                  type="button"
                  disabled={!habilitado}
                  onClick={() => escolherDia(data)}
                  className={[
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

          <p className="mt-4 text-[11px] text-slate-500">Dias em azul claro possuem atendimento disponivel.</p>
          {errors.data && <p className="mt-1 text-[11px] text-erro">{errors.data.message}</p>}
        </div>

        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Horarios disponiveis</h2>
            {!diaEscolhido ? (
              <p className="text-xs text-slate-500">Escolha primeiro um dia no calendario.</p>
            ) : horariosDoDia.length === 0 ? (
              <p className="text-xs text-slate-500">Nao ha horarios neste dia.</p>
            ) : (
              <div className="space-y-2">
                {horariosDoDia.map((horario) => (
                  <button
                    key={horario.id}
                    type="button"
                    onClick={() => setValue("hora", horario.inicio, opcoes)}
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
                    <span className="text-[11px] text-slate-400">{vagasLivres} vaga(s)</span>
                  </button>
                ))}
              </div>
            )}
            {errors.hora && diaEscolhido && <p className="mt-2 text-[11px] text-erro">{errors.hora.message}</p>}
          </div>

          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Resumo do agendamento</h2>
            <dl className="space-y-2.5 text-xs">
              <Linha icone={CalendarDays} rotulo="Data" valor={dataEscolhida ? formatarData(dataEscolhida) : "-"} />
              <Linha icone={Clock} rotulo="Horario" valor={horaEscolhida || "-"} />
              <Linha icone={MapPin} rotulo="Local" valor={oferta.local} />
            </dl>
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs">
              <span className="text-slate-500">Valor: </span>
              <strong className="text-slate-800">{formatarValor(oferta.valor)}</strong>
            </p>
            <Botao
              type="submit"
              larguraTotal
              className="mt-4"
              disabled={vagasLivres === 0}
              carregando={agendar.isPending}
            >
              Confirmar agendamento
            </Botao>
          </div>
        </aside>
      </form>
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
