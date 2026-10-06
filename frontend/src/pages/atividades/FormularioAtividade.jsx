/* ---------------------------------------------------------------------------
   pages/atividades/FormularioAtividade.jsx
   Formulario reaproveitado entre RegistrarAtividade e EditarAtividade.

   REACT HOOK FORM + ZOD:
   - register(): titulo, data, horas, descricao;
   - categoria (cartoes clicaveis) e comprovante (upload) nao sao inputs
     comuns: atualizam o formulario com setValue();
   - o Zod exige comprovante, data nao futura e horas entre 1 e 200;
   - erros do servidor aparecem no <Alerta>.
   TANSTACK QUERY: useResumoHoras mostra o progresso na lateral.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, BookOpen, FlaskConical, HeartHandshake, CalendarDays, Trash2, FileText } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useResumoHoras } from "../../queries";
import { atividadeSchema, TAMANHO_MAXIMO_COMPROVANTE } from "../../schemas/atividadeSchemas";
import { arquivoParaBase64 } from "../../utils/imagem";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";
import { ProgressoCircular } from "../../components/ui/Progresso";

const CATEGORIAS = [
  { nome: "Ensino", icone: BookOpen },
  { nome: "Pesquisa", icone: FlaskConical },
  { nome: "Extensao", icone: HeartHandshake },
  { nome: "Evento", icone: CalendarDays },
];

export default function FormularioAtividade({ valoresIniciais, aoSalvar, titulo, subtitulo, rotuloBotao }) {
  const navegar = useNavigate();
  const toast = useToast();
  const { usuario } = useAuth();
  const { data: resumo } = useResumoHoras(usuario?.id);

  const [arrastando, setArrastando] = useState(false);
  const [tamanhoArquivo, setTamanhoArquivo] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(atividadeSchema),
    defaultValues: valoresIniciais,
    mode: "onTouched",
  });

  const categoria = useWatch({ control, name: "categoria" });
  const comprovante = useWatch({ control, name: "comprovante" });
  const comprovanteArquivo = useWatch({ control, name: "comprovanteArquivo" });
  const opcoes = { shouldDirty: true, shouldValidate: isSubmitted };

  /* ------------------------ Upload (clique ou arrastar) ------------------------ */
  async function processarArquivo(arquivo) {
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO_COMPROVANTE) {
      return toast.erro("Arquivo muito grande. O limite maximo e de 2 MB.");
    }
    try {
      const base64 = await arquivoParaBase64(arquivo);
      setValue("comprovante", arquivo.name, opcoes);
      setValue("comprovanteArquivo", base64, opcoes);
      setTamanhoArquivo(arquivo.size);
    } catch {
      toast.erro("Erro ao processar o arquivo. Tente novamente.");
    }
  }

  function aoSoltar(e) {
    e.preventDefault();
    setArrastando(false);
    processarArquivo(e.dataTransfer.files?.[0]);
  }

  function removerArquivo() {
    setValue("comprovante", "", opcoes);
    setValue("comprovanteArquivo", "", opcoes);
    setTamanhoArquivo(null);
  }

  /* --------------------------------- Envio --------------------------------- */
  async function aoEnviar(dados) {
    clearErrors("root.servidor");
    try {
      await aoSalvar(dados);
    } catch (e) {
      setError("root.servidor", { message: e.message });
    }
  }

  const ehPdf = comprovanteArquivo?.startsWith("data:application/pdf");

  return (
    <>
      <Cabecalho titulo={titulo} subtitulo={subtitulo} />

      {errors.root?.servidor && (
        <Alerta variante="erro" className="mb-4">
          {errors.root.servidor.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="grid gap-4 lg:grid-cols-3">
        <div className="cartao space-y-5 p-6 lg:col-span-2">
          {/* Categoria */}
          <div>
            <p className="rotulo">Categoria</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIAS.map(({ nome, icone: Icone }) => (
                <button
                  key={nome}
                  type="button"
                  onClick={() => setValue("categoria", nome, opcoes)}
                  className={[
                    "flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-[11px] font-medium transition",
                    categoria === nome
                      ? "border-marca-600 bg-marca-50 text-marca-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Icone size={16} />
                  {nome}
                </button>
              ))}
            </div>
            {errors.categoria && <p className="mt-1 text-[11px] text-erro">{errors.categoria.message}</p>}
          </div>

          <Campo
            rotulo="Nome da atividade"
            placeholder="Ex.: Semana Nacional de Ciencia e Tecnologia"
            erro={errors.titulo?.message}
            {...register("titulo")}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Data de conclusao" type="date" erro={errors.data?.message} {...register("data")} />
            <Campo
              rotulo="Carga horaria (horas)"
              type="number"
              min="1"
              erro={errors.horas?.message}
              {...register("horas")}
            />
          </div>

          <CampoTexto rotulo="Descricao (opcional)" linhas={3} erro={errors.descricao?.message} {...register("descricao")} />

          {/* Comprovante */}
          <div>
            <p className="rotulo">Comprovante (max: 2 MB)</p>
            {!comprovante ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={aoSoltar}
                className={[
                  "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition",
                  errors.comprovante
                    ? "border-red-300 bg-red-50/40"
                    : arrastando
                      ? "border-marca-500 bg-marca-50"
                      : "border-slate-300 hover:border-marca-400 hover:bg-marca-50/40",
                ].join(" ")}
              >
                <Upload size={24} className={arrastando ? "text-marca-600" : "text-slate-400"} />
                <span className="text-sm font-medium text-slate-700">
                  {arrastando ? "Solte o arquivo aqui" : "Clique ou arraste o certificado"}
                </span>
                <span className="text-[11px] text-slate-400">PDF, JPG ou PNG ate 2 MB</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => processarArquivo(e.target.files?.[0])}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {comprovanteArquivo && !ehPdf ? (
                      <img src={comprovanteArquivo} alt="Miniatura" className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{comprovante}</p>
                    <p className="text-[11px] text-slate-500">
                      {tamanhoArquivo ? `${(tamanhoArquivo / 1024 / 1024).toFixed(2)} MB` : "Arquivo ja enviado"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removerArquivo}
                  className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Remover arquivo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            {errors.comprovante && <p className="mt-1 text-[11px] text-erro">{errors.comprovante.message}</p>}
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Botao type="button" variante="contorno" onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
            <Botao type="submit" carregando={isSubmitting}>
              {rotuloBotao}
            </Botao>
          </div>
        </div>

        <aside className="cartao h-fit p-5">
          <h2 className="titulo-secao mb-4">Seu progresso</h2>
          {resumo && (
            <>
              <div className="flex justify-center">
                <ProgressoCircular
                  percentual={resumo.percentual}
                  legenda={`${resumo.horasAprovadas}h de ${resumo.meta}h`}
                />
              </div>
              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
                Atividades novas ou editadas entram como <strong>Em analise</strong> e so passam a contar
                nas horas depois de aprovadas pela coordenacao.
              </p>
            </>
          )}
        </aside>
      </form>
    </>
  );
}
