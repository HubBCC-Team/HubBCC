/* ---------------------------------------------------------------------------
   pages/oportunidades/RealizarCandidatura.jsx
   TELA 9 - Realizar candidatura (rota "/app/oportunidades/:id/candidatura").
   Caso de uso 6. Passo a passo em 3 etapas; o envio acontece na ultima.

   - useOportunidade(id)       (TanStack Query) busca a oportunidade.
   - useForm + zodResolver     (React Hook Form + Zod) controla e valida a
     carta de motivacao. Ao clicar "Continuar" na etapa 2, trigger("carta")
     valida o campo antes de avancar.
   - useRealizarCandidatura    (useMutation) envia. Erros da API (ex.:
     candidatura duplicada) aparecem no <Alerta>.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOportunidade, useRealizarCandidatura } from "../../queries";
import { candidaturaSchema, CARTA_MAXIMO } from "../../schemas/oportunidadeSchemas";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import Cabecalho from "../../components/ui/Cabecalho";
import { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import Alerta from "../../components/ui/Alerta";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

const ETAPAS = ["Dados", "Motivacao", "Confirmacao"];

export default function RealizarCandidatura() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();
  const [etapa, setEtapa] = useState(1);

  const { data: oportunidade, isLoading, isError, error, refetch } = useOportunidade(id);
  const enviar = useRealizarCandidatura();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(candidaturaSchema),
    defaultValues: { carta: "" },
    mode: "onTouched",
  });

  const carta = watch("carta");

  if (isLoading) return <Carregando />;
  if (isError) return <Erro mensagem={error.message} aoTentarNovamente={refetch} />;
  if (!oportunidade) return null;

  // Oportunidade encerrada: nao deixa nem comecar.
  if (oportunidade.situacao === "Encerrada") {
    return (
      <>
        <Cabecalho titulo="Realizar candidatura" subtitulo={oportunidade.titulo} />
        <Alerta variante="aviso">As inscricoes desta oportunidade estao encerradas.</Alerta>
        <Botao variante="contorno" className="mt-4" onClick={() => navegar(-1)}>
          Voltar
        </Botao>
      </>
    );
  }

  async function avancar() {
    // Na etapa 2 so avanca se a carta passar no schema Zod.
    if (etapa === 2) {
      const valida = await trigger("carta");
      if (!valida) return;
    }
    setEtapa(etapa + 1);
  }

  // Chamado pelo handleSubmit apenas com dados validos.
  function aoConfirmar({ carta: cartaValidada }) {
    enviar.mutate(
      { usuarioId: usuario.id, oportunidadeId: oportunidade.id, carta: cartaValidada },
      {
        onSuccess: () => {
          toast.sucesso("Candidatura enviada com sucesso!");
          navegar("/app/candidaturas");
        },
      }
    );
  }

  return (
    <>
      <Cabecalho titulo="Realizar candidatura" subtitulo={oportunidade.titulo} />

      <div className="mb-6 flex items-center gap-2">
        {ETAPAS.map((nome, indice) => {
          const numero = indice + 1;
          const concluida = etapa > numero;
          const atual = etapa === numero;
          return (
            <div key={nome} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium",
                  concluida
                    ? "bg-sucesso text-white"
                    : atual
                      ? "bg-marca-600 text-white"
                      : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {concluida ? <Check size={12} /> : numero}
              </span>
              <span className={`text-xs ${atual ? "font-medium text-slate-900" : "text-slate-500"}`}>{nome}</span>
              {numero < ETAPAS.length && <span className="mx-2 h-px w-8 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <form onSubmit={handleSubmit(aoConfirmar)} noValidate className="cartao p-6 lg:col-span-2">
          {/* Erro de envio vindo da API (ex.: "Voce ja se candidatou...") */}
          {enviar.isError && (
            <Alerta variante="erro" className="mb-4">
              {enviar.error.message}
            </Alerta>
          )}

          {etapa === 1 && (
            <>
              <h2 className="titulo-secao mb-4">Confira seus dados</h2>
              <dl className="grid gap-3 text-xs sm:grid-cols-2">
                <Dado rotulo="Nome" valor={usuario.nome} />
                <Dado rotulo="E-mail" valor={usuario.email} />
                <Dado rotulo="Matricula" valor={usuario.matricula} />
                <Dado rotulo="Periodo" valor={usuario.periodo} />
              </dl>
              <p className="mt-4 text-[11px] text-slate-500">Para alterar esses dados, acesse a tela de Perfil.</p>
            </>
          )}

          {/* O campo fica montado (so escondido) para o valor nao se perder
              ao navegar entre as etapas. */}
          <div className={etapa === 2 ? "" : "hidden"}>
            <h2 className="titulo-secao mb-4">Carta de motivacao</h2>
            <CampoTexto
              linhas={9}
              placeholder="Conte por que voce tem interesse nesta oportunidade..."
              dica={`${carta.length}/${CARTA_MAXIMO} caracteres`}
              erro={errors.carta?.message}
              {...register("carta")}
            />
          </div>

          {etapa === 3 && (
            <>
              <h2 className="titulo-secao mb-4">Confirme sua candidatura</h2>
              <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-800">Oportunidade:</strong> {oportunidade.titulo}
                </p>
                <p className="mt-1">
                  <strong className="text-slate-800">Candidato:</strong> {usuario.nome}
                </p>
                <p className="mt-3 whitespace-pre-wrap">{carta}</p>
              </div>
              <p className="mt-4 text-[11px] text-slate-500">
                Ao confirmar, sua candidatura sera enviada com a situacao "Em analise".
              </p>
            </>
          )}

          <div className="mt-6 flex justify-between gap-2 border-t border-slate-100 pt-4">
            <Botao
              type="button"
              variante="contorno"
              onClick={() => (etapa === 1 ? navegar(-1) : setEtapa(etapa - 1))}
            >
              {etapa === 1 ? "Cancelar" : "Voltar"}
            </Botao>

            {etapa < 3 ? (
              <Botao type="button" onClick={avancar}>
                Continuar
              </Botao>
            ) : (
              <Botao type="submit" carregando={enviar.isPending}>
                Confirmar candidatura
              </Botao>
            )}
          </div>
        </form>

        <aside className="cartao h-fit p-5">
          <Selo tom="marca">{oportunidade.tipo}</Selo>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">{oportunidade.titulo}</h3>
          <p className="mt-1 text-[11px] text-slate-500">{oportunidade.departamento}</p>
          <dl className="mt-4 space-y-2 text-[11px]">
            <Dado rotulo="Modalidade" valor={oportunidade.modalidade} />
            <Dado rotulo="Carga horaria" valor={oportunidade.cargaHoraria} />
            <Dado rotulo="Bolsa" valor={oportunidade.bolsa} />
            <Dado rotulo="Inscricoes ate" valor={formatarData(oportunidade.prazoInscricao)} />
          </dl>
        </aside>
      </div>
    </>
  );
}

function Dado({ rotulo, valor }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-500">{rotulo}</dt>
      <dd className="font-medium text-slate-800">{valor || "-"}</dd>
    </div>
  );
}
