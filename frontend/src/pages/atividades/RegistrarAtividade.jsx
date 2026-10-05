/* ---------------------------------------------------------------------------
   pages/atividades/RegistrarAtividade.jsx
   TELA 20 — Registrar atividade complementar ("/app/atividades/nova").

   Agora com suporte a arrastar-e-soltar, limite de 2MB e conversao
   do arquivo para Base64 para ser visualizado posteriormente.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  BookOpen,
  FlaskConical,
  HeartHandshake,
  CalendarDays,
  Trash2,
  FileText,
} from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useRequisicao } from "../../hooks/useRequisicao";
import { useFormulario } from "../../hooks/useFormulario";
import {
  registrarAtividade,
  resumoHoras,
} from "../../service/atividadeService";
import { arquivoParaBase64 } from "../../utils/imagem";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import { ProgressoCircular } from "../../components/ui/Progresso";

const CATEGORIAS = [
  { nome: "Ensino", icone: BookOpen },
  { nome: "Pesquisa", icone: FlaskConical },
  { nome: "Extensao", icone: HeartHandshake },
  { nome: "Evento", icone: CalendarDays },
];

export default function RegistrarAtividade() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const resumo = useRequisicao(
    () => resumoHoras(usuario.id),
    [usuario.id],
    null,
  );

  const { valores, aoMudar, definir } = useFormulario({
    categoria: "Ensino",
    titulo: "",
    data: "",
    horas: "",
    descricao: "",
  });

  const [comprovante, setComprovante] = useState(null);
  const [comprovanteBase64, setComprovanteBase64] = useState(null);
  const [arrastando, setArrastando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // ---------------- Lógica de Arquivos (Drag & Drop + 2MB Limite) ----------------
  async function processarArquivo(arquivo) {
    if (!arquivo) return;

    // Limite de 2 MB (2 * 1024 * 1024 bytes)
    if (arquivo.size > 2 * 1024 * 1024) {
      return toast.erro("Arquivo muito grande. O limite máximo é de 2 MB.");
    }

    try {
      const base64 = await arquivoParaBase64(arquivo);
      setComprovante(arquivo);
      setComprovanteBase64(base64);
    } catch (e) {
      toast.erro("Erro ao processar o arquivo. Tente novamente.");
    }
  }

  function aoSoltar(e) {
    e.preventDefault();
    setArrastando(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processarArquivo(e.dataTransfer.files[0]);
    }
  }

  function removerArquivo(e) {
    e.preventDefault(); // Evita acionar o label do input
    setComprovante(null);
    setComprovanteBase64(null);
  }

  // ---------------- Submissão do Formulário ----------------
  async function aoEnviar(evento) {
    evento.preventDefault();

    if (!comprovanteBase64) {
      return toast.erro("Anexe o comprovante da atividade.");
    }

    setEnviando(true);
    try {
      await registrarAtividade({
        usuarioId: usuario.id,
        ...valores,
        horas: Number(valores.horas),
        comprovante: comprovante.name,
        comprovanteArquivo: comprovanteBase64, // Salva o Base64 na base de dados
      });
      toast.sucesso("Atividade registrada com sucesso!");
      navegar("/app/atividades");
    } catch (e) {
      // Captura o erro clássico de localStorage cheio (QuotaExceededError)
      if (e.name === "QuotaExceededError" || e.message.includes("quota")) {
        toast.erro(
          "Memória cheia! O limite de testes do navegador (5MB) foi atingido. Apague atividades antigas.",
        );
      } else {
        toast.erro(e.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  const ehPdf = comprovanteBase64?.startsWith("data:application/pdf");

  return (
    <>
      <Cabecalho
        titulo="Registrar atividade complementar"
        subtitulo="Informe os dados e anexe o certificado para validacao"
      />

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        <div className="cartao space-y-5 p-6 lg:col-span-2">
          <div>
            <p className="rotulo">Categoria</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIAS.map(({ nome, icone: Icone }) => (
                <button
                  key={nome}
                  type="button"
                  onClick={() => definir("categoria", nome)}
                  className={[
                    "flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-[11px] font-medium transition",
                    valores.categoria === nome
                      ? "border-marca-600 bg-marca-50 text-marca-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Icone size={16} />
                  {nome}
                </button>
              ))}
            </div>
          </div>

          <Campo
            rotulo="Nome da atividade"
            name="titulo"
            required
            placeholder="Ex.: Semana Nacional de Ciencia e Tecnologia"
            value={valores.titulo}
            onChange={aoMudar}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo
              rotulo="Data de conclusao"
              name="data"
              type="date"
              required
              value={valores.data}
              onChange={aoMudar}
            />
            <Campo
              rotulo="Carga horaria (horas)"
              name="horas"
              type="number"
              min="1"
              required
              value={valores.horas}
              onChange={aoMudar}
            />
          </div>

          <CampoTexto
            rotulo="Descricao (opcional)"
            name="descricao"
            linhas={3}
            value={valores.descricao}
            onChange={aoMudar}
          />

          {/* ---------------- Área de Upload e Drag & Drop ---------------- */}
          <div>
            <p className="rotulo">Comprovante (Max: 2 MB)</p>
            {!comprovanteBase64 ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={aoSoltar}
                className={[
                  "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition",
                  arrastando
                    ? "border-marca-500 bg-marca-50"
                    : "border-slate-300 hover:border-marca-400 hover:bg-marca-50/40",
                ].join(" ")}
              >
                <Upload
                  size={24}
                  className={arrastando ? "text-marca-600" : "text-slate-400"}
                />
                <span className="text-sm font-medium text-slate-700">
                  {arrastando
                    ? "Solte o arquivo aqui"
                    : "Clique ou arraste o certificado"}
                </span>
                <span className="text-[11px] text-slate-400">
                  PDF, JPG ou PNG até 2 MB
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => processarArquivo(e.target.files[0])}
                />
              </label>
            ) : (
              /* Miniatura e botão de remover quando o arquivo já foi escolhido */
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                    {ehPdf ? (
                      <FileText size={24} className="text-slate-400" />
                    ) : (
                      <img
                        src={comprovanteBase64}
                        alt="Miniatura"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {comprovante.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(comprovante.size / 1024 / 1024).toFixed(2)} MB
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
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Botao
              type="button"
              variante="contorno"
              onClick={() => navegar(-1)}
            >
              Cancelar
            </Botao>
            <Botao type="submit" carregando={enviando}>
              Registrar atividade
            </Botao>
          </div>
        </div>

        <aside className="cartao h-fit p-5">
          <h2 className="titulo-secao mb-4">Seu progresso</h2>
          {resumo.dados && (
            <>
              <div className="flex justify-center">
                <ProgressoCircular
                  percentual={resumo.dados.percentual}
                  legenda={`${resumo.dados.horasAprovadas}h de ${resumo.dados.meta}h`}
                />
              </div>
              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
                Atividades novas entram como <strong>Em analise</strong> e so
                passam a contar nas horas depois de aprovadas pela coordenacao.
              </p>
            </>
          )}
        </aside>
      </form>
    </>
  );
}
