/* ---------------------------------------------------------------------------
   pages/agendamentos/MeusAgendamentos.jsx
   TELAS 16, 17 e 19 - Meus agendamentos + modal de reagendar + modal de avaliar.
   Casos de uso 15 (consultar), 16 (reagendar/cancelar) e 18 (avaliar).

   TANSTACK QUERY:
   - useAgendamentos(usuarioId, { situacao: aba })  -> lista por aba
   - useCancelarAgendamento / useReagendar / useAvaliarAtendimento
     Depois de cada uma, a lista e invalidada sozinha (sem "recarregar").
   REACT HOOK FORM + ZOD: os dois modais tem formularios proprios.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import {
  useAgendamentos,
  useCancelarAgendamento,
  useReagendar,
  useAvaliarAtendimento,
} from "../../queries";
import {
  reagendamentoSchema,
  avaliacaoSchema,
  TAGS_AVALIACAO,
  hojeLocalISO,
} from "../../schemas/agendamentoSchemas";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Modal from "../../components/ui/Modal";
import Alerta from "../../components/ui/Alerta";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Estrelas from "../../components/ui/Estrelas";
import { SeloSituacao } from "../../components/ui/Selo";
import { Erro, Vazio } from "../../components/ui/Estado";
import Skeleton from "../../components/ui/Skeleton";
import { formatarData } from "../../utils/formatadores";

const ABAS = ["Confirmado", "Realizado", "Cancelado"];

export default function MeusAgendamentos() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [aba, setAba] = useState("Confirmado");
  const [paraReagendar, setParaReagendar] = useState(null);
  const [paraAvaliar, setParaAvaliar] = useState(null);

  const { data: lista = [], isLoading, isFetching, isError, error, refetch } = useAgendamentos(usuario?.id, {
    situacao: aba,
  });
  const cancelar = useCancelarAgendamento();

  function aoCancelar(id) {
    if (!confirm("Deseja cancelar este agendamento? A vaga sera liberada.")) return;
    cancelar.mutate(id, {
      onSuccess: () => toast.sucesso("Agendamento cancelado com sucesso!"),
      onError: (e) => toast.erro(e.message || "Erro ao cancelar o agendamento."),
    });
  }

  return (
    <>
      <Cabecalho titulo="Meus Agendamentos" subtitulo="Acompanhe, reagende ou cancele seus atendimentos">
        <Botao as={Link} to="/app/apoio">
          <Plus size={14} /> Novo agendamento
        </Botao>
      </Cabecalho>

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
            {nome}s
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton variante="cartao" className="h-28" />
          <Skeleton variante="cartao" className="h-28" />
          <Skeleton variante="cartao" className="h-28" />
        </div>
      ) : isError ? (
        <Erro mensagem={error.message} aoTentarNovamente={refetch} />
      ) : lista.length === 0 ? (
        <Vazio
          titulo={`Nenhum agendamento ${aba.toLowerCase()}`}
          descricao="Procure uma monitoria ou tutoria no Apoio Academico."
          acao={
            <Botao as={Link} to="/app/apoio" tamanho="pequeno">
              Ver ofertas
            </Botao>
          }
        />
      ) : (
        <div className={`space-y-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {lista.map((item) => {
            const cancelandoEste = cancelar.isPending && cancelar.variables === item.id;
            return (
              <div
                key={item.id}
                className="cartao flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-marca-600 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-marca-50 text-marca-700">
                    <span className="text-base font-semibold">{item.data.slice(8, 10)}</span>
                    <span className="text-[10px] uppercase">{mesCurto(item.data)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.disciplina} · com {item.monitor}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} /> {formatarData(item.data)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {item.hora}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {item.local}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SeloSituacao situacao={item.situacao} />

                  {item.situacao === "Confirmado" && (
                    <>
                      <Botao variante="contorno" tamanho="pequeno" onClick={() => setParaReagendar(item)}>
                        Reagendar
                      </Botao>
                      <Botao
                        variante="perigo"
                        tamanho="pequeno"
                        onClick={() => aoCancelar(item.id)}
                        carregando={cancelandoEste}
                        disabled={cancelar.isPending}
                      >
                        Cancelar
                      </Botao>
                      <Botao as={Link} to={`/app/agendamentos/${item.id}/registrar`} tamanho="pequeno">
                        Registrar
                      </Botao>
                    </>
                  )}

                  {item.situacao === "Realizado" && !item.avaliacao && (
                    <Botao tamanho="pequeno" onClick={() => setParaAvaliar(item)}>
                      Avaliar
                    </Botao>
                  )}

                  {item.situacao === "Realizado" && item.avaliacao && <Estrelas nota={item.avaliacao.nota} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* key: recria o formulario do modal a cada agendamento aberto (limpa os campos) */}
      <Modal aberto={Boolean(paraReagendar)} aoFechar={() => setParaReagendar(null)} titulo="Reagendar atendimento">
        {paraReagendar && (
          <FormReagendar
            key={paraReagendar.id}
            agendamento={paraReagendar}
            aoFechar={() => setParaReagendar(null)}
          />
        )}
      </Modal>

      <Modal aberto={Boolean(paraAvaliar)} aoFechar={() => setParaAvaliar(null)} titulo="Avaliar atendimento">
        {paraAvaliar && (
          <FormAvaliar key={paraAvaliar.id} agendamento={paraAvaliar} aoFechar={() => setParaAvaliar(null)} />
        )}
      </Modal>
    </>
  );
}

/* ------------------------------------------------------------------------
   Modal REAGENDAR - React Hook Form + Zod (data futura + horario)
------------------------------------------------------------------------- */
function FormReagendar({ agendamento, aoFechar }) {
  const toast = useToast();
  const reagendar = useReagendar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reagendamentoSchema),
    defaultValues: { data: "", hora: "" },
    mode: "onTouched",
  });

  function aoConfirmar({ data, hora }) {
    reagendar.mutate(
      { id: agendamento.id, data, hora },
      {
        onSuccess: () => {
          toast.sucesso("Atendimento reagendado com sucesso!");
          aoFechar();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(aoConfirmar)} noValidate>
      <div className="mb-4 rounded-lg bg-slate-50 p-3 text-xs">
        <p className="font-medium text-slate-800">{agendamento.titulo}</p>
        <p className="mt-0.5 text-slate-500">
          Atual: {formatarData(agendamento.data)} as {agendamento.hora}
        </p>
      </div>

      {reagendar.isError && (
        <Alerta variante="erro" className="mb-3">
          {reagendar.error.message}
        </Alerta>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Campo rotulo="Nova data" type="date" min={hojeLocalISO()} erro={errors.data?.message} {...register("data")} />
        <Campo rotulo="Novo horario" type="time" erro={errors.hora?.message} {...register("hora")} />
      </div>

      <div className="mt-5 flex gap-2">
        <Botao type="button" variante="contorno" larguraTotal onClick={aoFechar}>
          Voltar
        </Botao>
        <Botao type="submit" larguraTotal carregando={reagendar.isPending}>
          Confirmar
        </Botao>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------------
   Modal AVALIAR - React Hook Form + Zod (nota 1-5, tags, comentario)
   Estrelas e tags nao sao <input>: atualizam o formulario com setValue().
------------------------------------------------------------------------- */
function FormAvaliar({ agendamento, aoFechar }) {
  const toast = useToast();
  const avaliar = useAvaliarAtendimento();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: { nota: 0, tags: [], comentario: "" },
  });

  const nota = watch("nota");
  const tags = watch("tags");

  function alternarTag(tag) {
    const novas = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    setValue("tags", novas, { shouldDirty: true });
  }

  function aoConfirmar(avaliacao) {
    avaliar.mutate(
      { id: agendamento.id, avaliacao },
      {
        onSuccess: () => {
          toast.sucesso("Avaliacao enviada com sucesso!");
          aoFechar();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(aoConfirmar)} noValidate className="text-center">
      <p className="text-sm text-slate-600">Como foi a monitoria?</p>
      <p className="mt-0.5 text-xs text-slate-400">{agendamento.titulo}</p>

      <div className="my-5 flex flex-col items-center gap-1">
        <Estrelas
          nota={nota}
          aoSelecionar={(valor) => setValue("nota", valor, { shouldValidate: isSubmitted })}
          tamanho={30}
        />
        {errors.nota && <p className="text-[11px] text-erro">{errors.nota.message}</p>}
      </div>

      <p className="mb-2 text-[11px] text-slate-500">O que se destacou?</p>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {TAGS_AVALIACAO.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => alternarTag(tag)}
            className={[
              "rounded-full px-3 py-1 text-[11px] transition",
              tags.includes(tag)
                ? "bg-marca-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {tag}
          </button>
        ))}
      </div>

      <CampoTexto
        className="text-left"
        linhas={3}
        placeholder="Deixe um comentario (opcional)"
        erro={errors.comentario?.message}
        {...register("comentario")}
      />

      {avaliar.isError && (
        <Alerta variante="erro" className="mt-3 text-left">
          {avaliar.error.message}
        </Alerta>
      )}

      <Botao type="submit" larguraTotal className="mt-4" carregando={avaliar.isPending}>
        Enviar avaliacao
      </Botao>
    </form>
  );
}

function mesCurto(iso) {
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  return meses[Number(iso.slice(5, 7)) - 1];
}
