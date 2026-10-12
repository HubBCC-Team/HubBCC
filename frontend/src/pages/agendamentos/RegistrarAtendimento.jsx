/* ---------------------------------------------------------------------------
   pages/agendamentos/RegistrarAtendimento.jsx
   TELA 18 - Registrar atendimento ("/app/agendamentos/:id/registrar").
   Caso de uso 17. Ao final da sessao: o aluno compareceu? duracao? observacoes?

   Quem registra o atendimento e o MONITOR responsavel pela oferta.
   O agendamento pertence ao aluno, entao:
   1) buscamos o agendamento pelo id;
   2) buscamos a oferta vinculada pelo ofertaId;
   3) verificamos se oferta.monitorId corresponde ao usuario logado.

   - useAgendamento(id)        busca o agendamento.
   - useOferta(ofertaId)       busca a oferta responsavel.
   - useForm + zodResolver     valida o registro.
   - useRegistrarAtendimento   grava e marca como "Realizado".
--------------------------------------------------------------------------- */

import {
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  X,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import {
  useAgendamento,
  useOferta,
  useRegistrarAtendimento,
} from "../../queries";
import { registroAtendimentoSchema } from "../../schemas/agendamentoSchemas";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, {
  CampoTexto,
} from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";
import {
  Carregando,
  Erro,
} from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

export default function RegistrarAtendimento() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const {
    data: agendamento,
    isLoading: carregandoAgendamento,
    isError: erroAgendamento,
    error: erroDoAgendamento,
    refetch: recarregarAgendamento,
  } = useAgendamento(id);

  const {
    data: oferta,
    isLoading: carregandoOferta,
    isError: erroOferta,
    error: erroDaOferta,
    refetch: recarregarOferta,
  } = useOferta(agendamento?.ofertaId);

  const registrar = useRegistrarAtendimento();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroAtendimentoSchema),
    defaultValues: {
      compareceu: true,
      duracao: 60,
      observacoes: "",
    },
    mode: "onTouched",
  });

  const compareceu = useWatch({
    control,
    name: "compareceu",
  });

  if (carregandoAgendamento) {
    return <Carregando />;
  }

  if (erroAgendamento) {
    return (
      <Erro
        mensagem={erroDoAgendamento.message}
        aoTentarNovamente={recarregarAgendamento}
      />
    );
  }

  if (!agendamento) {
    return (
      <Erro mensagem="Agendamento nao encontrado." />
    );
  }

  if (carregandoOferta) {
    return <Carregando />;
  }

  if (erroOferta) {
    return (
      <Erro
        mensagem={erroDaOferta.message}
        aoTentarNovamente={recarregarOferta}
      />
    );
  }

  if (!oferta) {
    return (
      <Erro mensagem="Oferta vinculada nao encontrada." />
    );
  }

  const ehMonitorResponsavel =
    String(oferta.monitorId) === String(usuario?.id);

  if (!ehMonitorResponsavel) {
    return (
      <Navigate
        to="/sem-acesso"
        replace
      />
    );
  }

  if (agendamento.situacao !== "Confirmado") {
    return (
      <>
        <Cabecalho
          titulo="Registrar atendimento"
          subtitulo={agendamento.titulo}
        />

        <Alerta variante="aviso">
          Este agendamento esta "{agendamento.situacao}" e
          nao pode mais ser registrado.
        </Alerta>

        <Botao
          variante="contorno"
          className="mt-4"
          onClick={() => navegar(-1)}
        >
          Voltar
        </Botao>
      </>
    );
  }

  function aoSalvar(registro) {
    registrar.mutate(
      {
        id: agendamento.id,
        registro,
      },
      {
        onSuccess: () => {
          toast.sucesso(
            "Atendimento registrado com sucesso!",
          );
          navegar(-1);
        },
      },
    );
  }

  function classeOpcao(valor) {
    const ativo = compareceu === valor;

    return [
      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition",
      ativo
        ? valor
          ? "border-sucesso bg-green-50 text-sucesso"
          : "border-erro bg-red-50 text-erro"
        : "border-slate-200 text-slate-600 hover:bg-slate-50",
    ].join(" ");
  }

  return (
    <>
      <Cabecalho
        titulo="Registrar atendimento"
        subtitulo="Informe como foi a sessao para concluir o agendamento"
      />

      {registrar.isError && (
        <Alerta
          variante="erro"
          className="mb-4"
        >
          {registrar.error.message}
        </Alerta>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit(aoSalvar)}
          noValidate
          className="cartao space-y-5 p-6 lg:col-span-2"
        >
          <h2 className="titulo-secao">
            Registro da sessao
          </h2>

          <div>
            <p className="rotulo">
              O aluno compareceu?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setValue("compareceu", true, {
                    shouldValidate: true,
                  })
                }
                className={classeOpcao(true)}
              >
                <Check size={14} />
                Sim
              </button>

              <button
                type="button"
                onClick={() =>
                  setValue("compareceu", false, {
                    shouldValidate: true,
                  })
                }
                className={classeOpcao(false)}
              >
                <X size={14} />
                Nao
              </button>
            </div>
          </div>

          {compareceu && (
            <Campo
              rotulo="Duracao do atendimento (minutos)"
              type="number"
              min="0"
              step="15"
              erro={errors.duracao?.message}
              {...register("duracao")}
            />
          )}

          <CampoTexto
            rotulo="Observacoes"
            linhas={5}
            placeholder="Conteudos trabalhados, dificuldades observadas, proximos passos..."
            erro={errors.observacoes?.message}
            {...register("observacoes")}
          />

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Botao
              type="button"
              variante="contorno"
              onClick={() => navegar(-1)}
            >
              Cancelar
            </Botao>

            <Botao
              type="submit"
              carregando={registrar.isPending}
            >
              Registrar sessao
            </Botao>
          </div>
        </form>

        <aside className="cartao h-fit p-5">
          <h2 className="titulo-secao mb-3">
            Agendamento
          </h2>

          <p className="text-sm font-semibold text-slate-900">
            {agendamento.titulo}
          </p>

          <p className="text-[11px] text-slate-500">
            {agendamento.disciplina}
          </p>

          <dl className="mt-4 space-y-2.5 text-xs">
            <Linha
              icone={CalendarDays}
              rotulo="Data"
              valor={formatarData(agendamento.data)}
            />

            <Linha
              icone={Clock}
              rotulo="Horario"
              valor={agendamento.hora}
            />

            <Linha
              icone={MapPin}
              rotulo="Local"
              valor={agendamento.local}
            />
          </dl>
        </aside>
      </div>
    </>
  );
}

function Linha({
  icone: Icone,
  rotulo,
  valor,
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icone
        size={14}
        className="shrink-0 text-slate-400"
      />

      <div>
        <dt className="text-[11px] text-slate-500">
          {rotulo}
        </dt>

        <dd className="font-medium text-slate-800">
          {valor}
        </dd>
      </div>
    </div>
  );
}
