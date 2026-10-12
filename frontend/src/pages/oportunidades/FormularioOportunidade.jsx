/* ---------------------------------------------------------------------------
   pages/oportunidades/FormularioOportunidade.jsx
   Formulario reaproveitado entre Cadastrar (tela 10) e Editar oportunidade.

   REACT HOOK FORM + ZOD:
   - useForm controla os campos (register liga cada input ao formulario);
   - zodResolver(schema) valida tudo com o Zod antes do envio;
   - formState.errors traz a mensagem de cada campo -> prop "erro" do <Campo>;
   - os erros do SERVIDOR continuam aparecendo no componente <Alerta>.

   PROPS:
   - valoresIniciais: campos no formato do formulario (requisitos/atividades
     como texto, uma linha por item).
   - schema: schema Zod (cadastro ou edicao).
   - aoSalvar: funcao async que recebe os dados JA VALIDADOS e TRANSFORMADOS
     pelo Zod (vagas numero, requisitos/atividades em array). Se der erro,
     deve lancar (throw) - este componente mostra a mensagem no Alerta.
--------------------------------------------------------------------------- */
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import Alerta from "../../components/ui/Alerta";
import { TIPOS_OPORTUNIDADE, MODALIDADES } from "../../schemas/oportunidadeSchemas";

export default function FormularioOportunidade({
  valoresIniciais,
  schema,
  aoSalvar,
  titulo,
  subtitulo,
  rotuloBotao = "Salvar",
}) {
  const navegar = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
    mode: "onTouched", // valida ao sair do campo; depois, a cada digitacao
  });

  // useWatch le os valores em tempo real para a pre-visualizacao.
  const [tipo, tituloDigitado, departamento, descricao] = useWatch({ control, name: [
    "tipo",
    "titulo",
    "departamento",
    "descricao",
  ] });

  // So e chamado quando o Zod aprovou todos os campos.
  async function aoEnviar(dadosValidados) {
    clearErrors("root.servidor");
    try {
      await aoSalvar(dadosValidados);
    } catch (e) {
      // Erro vindo da API (ex.: servidor fora do ar) -> Alerta no topo.
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

      {/* noValidate: desliga a validacao nativa do navegador; quem valida e o Zod */}
      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="grid gap-4 lg:grid-cols-3">
        {/* -------------------------- Formulario -------------------------- */}
        <div className="cartao space-y-4 p-6 lg:col-span-2">
          <h2 className="titulo-secao">Informacoes da oportunidade</h2>

          <Campo rotulo="Titulo" erro={errors.titulo?.message} {...register("titulo")} />

          <div className="grid gap-3 sm:grid-cols-2">
            <CampoSelecao
              rotulo="Tipo"
              placeholder="Selecione"
              opcoes={TIPOS_OPORTUNIDADE}
              erro={errors.tipo?.message}
              {...register("tipo")}
            />
            <Campo rotulo="Area" erro={errors.area?.message} {...register("area")} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Departamento" erro={errors.departamento?.message} {...register("departamento")} />
            <Campo rotulo="Responsavel" erro={errors.responsavel?.message} {...register("responsavel")} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CampoSelecao
              rotulo="Modalidade"
              placeholder="Selecione"
              opcoes={MODALIDADES}
              erro={errors.modalidade?.message}
              {...register("modalidade")}
            />
            <Campo rotulo="Local" erro={errors.local?.message} {...register("local")} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Campo
              rotulo="Bolsa"
              placeholder="R$ 700,00 ou Nao remunerada"
              erro={errors.bolsa?.message}
              {...register("bolsa")}
            />
            <Campo
              rotulo="Carga horaria"
              placeholder="12h/semana"
              erro={errors.cargaHoraria?.message}
              {...register("cargaHoraria")}
            />
            <Campo rotulo="Vagas" type="number" min="1" erro={errors.vagas?.message} {...register("vagas")} />
          </div>

          <Campo
            rotulo="Prazo de inscricao"
            type="date"
            erro={errors.prazoInscricao?.message}
            {...register("prazoInscricao")}
          />

          <CampoTexto rotulo="Descricao" linhas={4} erro={errors.descricao?.message} {...register("descricao")} />

          <CampoTexto
            rotulo="Requisitos"
            linhas={4}
            dica="Escreva um requisito por linha."
            erro={errors.requisitos?.message}
            {...register("requisitos")}
          />

          <CampoTexto
            rotulo="Atividades previstas"
            linhas={4}
            dica="Escreva uma atividade por linha."
            erro={errors.atividades?.message}
            {...register("atividades")}
          />
        </div>

        {/* ----------------------- Pre-visualizacao ----------------------- */}
        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Pre-visualizacao</h2>
            <div className="rounded-xl border border-slate-200 p-4">
              {tipo && <Selo tom="marca">{tipo}</Selo>}
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {tituloDigitado || "Titulo da oportunidade"}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">{departamento || "Departamento"}</p>
              <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                {descricao || "A descricao aparece aqui conforme voce digita."}
              </p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={isSubmitting}>
              {rotuloBotao}
            </Botao>
            <Botao type="button" variante="contorno" larguraTotal onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
          </div>
        </aside>
      </form>
    </>
  );
}
