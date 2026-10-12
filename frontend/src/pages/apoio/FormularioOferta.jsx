/* ---------------------------------------------------------------------------
   pages/apoio/FormularioOferta.jsx
   Formulario reaproveitado entre CriarOferta (tela 14) e EditarOferta.
   Antes, as duas telas tinham ~150 linhas de formulario duplicadas.

   REACT HOOK FORM + ZOD:
   - register() liga os campos comuns (texto, select, checkbox);
   - os HORARIOS nao sao um <input>: a GradeHorarios chama alternarHorario,
     que atualiza o campo "horarios" com setValue(). O Zod exige ao menos 1;
   - formState.errors mostra a mensagem embaixo de cada campo;
   - erros do SERVIDOR aparecem no <Alerta> (root.servidor).

   PROPS:
   - valoresIniciais : valores do formulario (inclui horarios: [])
   - aoSalvar        : async (dadosValidados) => ... ; se der erro, lancar
   - titulo, subtitulo, rotuloBotao
   - acoesExtras     : botoes adicionais na coluna lateral (ex.: Cancelar oferta)
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRight } from "lucide-react";
import { useDisciplinas } from "../../queries";
import { ofertaSchema, TIPOS_OFERTA, MODALIDADES_OFERTA } from "../../schemas/apoioSchemas";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";
import GradeHorarios from "../../components/ui/GradeHorarios";

export default function FormularioOferta({
  valoresIniciais,
  aoSalvar,
  titulo,
  subtitulo,
  rotuloBotao = "Salvar",
  acoesExtras = null,
}) {
  const navegar = useNavigate();
  const { data: disciplinas = [], isLoading: carregandoDisciplinas } = useDisciplinas();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(ofertaSchema),
    defaultValues: valoresIniciais,
    mode: "onTouched",
  });

  const horarios = useWatch({ control, name: "horarios" });
  const gratuita = useWatch({ control, name: "gratuita" });
  const vagas = useWatch({ control, name: "vagas" });

  // Marca/desmarca um horario da grade (cada bloco tem 2 horas).
  function alternarHorario(dia, inicio) {
    const chave = `${dia}-${inicio}`;
    const jaSelecionado = horarios.some((h) => h.id === chave);
    const fim = `${String(Number(inicio.slice(0, 2)) + 2).padStart(2, "0")}:00`;

    const novos = jaSelecionado
      ? horarios.filter((h) => h.id !== chave)
      : [...horarios, { id: chave, dia, inicio, fim }];

    // shouldValidate depois da 1a tentativa de envio: a mensagem some/aparece na hora.
    setValue("horarios", novos, { shouldDirty: true, shouldValidate: isSubmitted });
  }

  async function aoEnviar(dados) {
    clearErrors("root.servidor");
    // Nome da disciplina tambem e gravado (a lista e os cards usam esse texto).
    const disciplina = disciplinas.find((d) => d.id === dados.disciplinaId);
    try {
      await aoSalvar({ ...dados, disciplina: disciplina?.nome ?? "" });
    } catch (e) {
      setError("root.servidor", { message: e.message });
    }
  }

  return (
    <>
      <Cabecalho titulo={titulo} subtitulo={subtitulo} />

      {errors.root?.servidor && (
        <Alerta variante="erro" className="mb-4">
          {errors.root.servidor.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* ----------------------- Dados da oferta ----------------------- */}
          <div className="cartao space-y-4 p-6">
            <h2 className="titulo-secao">Dados da oferta</h2>

            <Campo
              rotulo="Titulo"
              placeholder="Ex.: Tutoria de Calculo I"
              erro={errors.titulo?.message}
              {...register("titulo")}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <CampoSelecao
                rotulo="Disciplina"
                placeholder={carregandoDisciplinas ? "Carregando..." : "Selecione"}
                disabled={carregandoDisciplinas}
                opcoes={disciplinas.map((d) => ({ valor: d.id, texto: `${d.codigo} - ${d.nome}` }))}
                erro={errors.disciplinaId?.message}
                {...register("disciplinaId")}
              />
              <CampoSelecao rotulo="Tipo" opcoes={TIPOS_OFERTA} erro={errors.tipo?.message} {...register("tipo")} />
            </div>

            <Campo
              rotulo="Assuntos abordados"
              placeholder="Ex.: Limites, derivadas e integrais"
              erro={errors.assunto?.message}
              {...register("assunto")}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <CampoSelecao
                rotulo="Modalidade"
                opcoes={MODALIDADES_OFERTA}
                erro={errors.modalidade?.message}
                {...register("modalidade")}
              />
              <Campo rotulo="Local / link" erro={errors.local?.message} {...register("local")} />
              <Campo rotulo="Vagas" type="number" min="1" erro={errors.vagas?.message} {...register("vagas")} />
            </div>

            <CampoTexto rotulo="Descricao" linhas={4} erro={errors.descricao?.message} {...register("descricao")} />
          </div>

          {/* --------------------- Grade de horarios --------------------- */}
          {/* Aviso apenas visivel no celular (md:hidden) para alertar sobre o scroll */}
          <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500 md:hidden">
            <ArrowLeftRight size={12} className="shrink-0" />
            <p>Arraste a tabela para o lado para ver mais horarios</p>
          </div>

          <GradeHorarios horarios={horarios} aoAlterar={alternarHorario} />

          {errors.horarios && (
            <Alerta variante="erro">{errors.horarios.message ?? errors.horarios.root?.message}</Alerta>
          )}
        </div>

        {/* -------------------------- Coluna lateral -------------------------- */}
        <aside className="space-y-4">
          <div className="cartao space-y-4 p-5">
            <h2 className="titulo-secao">Valor do atendimento</h2>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" {...register("gratuita")} />
              Atendimento gratuito
            </label>

            {!gratuita && (
              <Campo
                rotulo="Valor por atendimento (R$)"
                type="number"
                min="0"
                step="5"
                erro={errors.valor?.message}
                {...register("valor")}
              />
            )}

            <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
              <p className="font-medium text-slate-800">Resumo</p>
              <p className="mt-1">{horarios.length} horario(s) selecionado(s)</p>
              <p>{vagas || 0} vaga(s) por horario</p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={isSubmitting}>
              {rotuloBotao}
            </Botao>
            <Botao type="button" variante="contorno" larguraTotal onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
            {acoesExtras}
          </div>
        </aside>
      </form>
    </>
  );
}
