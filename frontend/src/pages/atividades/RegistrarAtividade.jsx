/* ---------------------------------------------------------------------------
   pages/atividades/RegistrarAtividade.jsx
   TELA 20 — Registrar atividade complementar ("/app/atividades/nova").

   Caso de uso 19. O upload do comprovante e apenas simulado: guardamos o
   NOME do arquivo. Com backend real, use FormData para enviar o arquivo.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, FlaskConical, HeartHandshake, CalendarDays } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import { useFormulario } from "../../hooks/useFormulario";
import { registrarAtividade, resumoHoras } from "../../service/atividadeService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import { ProgressoCircular } from "../../components/ui/Progresso";

// Categorias exibidas como cartoes clicaveis.
const CATEGORIAS = [
  { nome: "Ensino", icone: BookOpen },
  { nome: "Pesquisa", icone: FlaskConical },
  { nome: "Extensao", icone: HeartHandshake },
  { nome: "Evento", icone: CalendarDays },
];

export default function RegistrarAtividade() {
  const navegar = useNavigate();
  const { usuario } = useAuth();

  const resumo = useRequisicao(() => resumoHoras(usuario.id), [usuario.id], null);

  const { valores, aoMudar, definir } = useFormulario({
    categoria: "Ensino",
    titulo: "",
    data: "",
    horas: "",
    descricao: "",
  });

  const [comprovante, setComprovante] = useState(null);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);

    if (!comprovante) {
      return setErro("Anexe o comprovante da atividade.");
    }

    setEnviando(true);
    try {
      await registrarAtividade({
        usuarioId: usuario.id,
        ...valores,
        horas: Number(valores.horas),
        comprovante: comprovante.name,
      });
      navegar("/app/atividades");
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Registrar atividade complementar"
        subtitulo="Informe os dados e anexe o certificado para validacao"
      />

      {erro && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        <div className="cartao space-y-5 p-6 lg:col-span-2">
          {/* Selecao de categoria */}
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
            <Campo rotulo="Data de conclusao" name="data" type="date" required value={valores.data} onChange={aoMudar} />
            <Campo rotulo="Carga horaria (horas)" name="horas" type="number" min="1" required value={valores.horas} onChange={aoMudar} />
          </div>

          <CampoTexto
            rotulo="Descricao (opcional)"
            name="descricao"
            linhas={3}
            value={valores.descricao}
            onChange={aoMudar}
          />

          {/* Area de upload. O input real fica escondido dentro da label. */}
          <div>
            <p className="rotulo">Comprovante</p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-marca-400 hover:bg-marca-50/40">
              <Upload size={20} className="text-slate-400" />
              <span className="text-xs text-slate-600">
                {comprovante ? comprovante.name : "Clique para anexar o certificado"}
              </span>
              <span className="text-[11px] text-slate-400">PDF, JPG ou PNG ate 5 MB</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setComprovante(e.target.files[0])}
              />
            </label>
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Botao type="button" variante="contorno" onClick={() => navegar(-1)}>
              Cancelar
            </Botao>
            <Botao type="submit" carregando={enviando}>
              Registrar atividade
            </Botao>
          </div>
        </div>

        {/* Progresso atual, para contexto */}
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
                Atividades novas entram como <strong>Em analise</strong> e so passam a contar
                nas horas depois de aprovadas pela coordenacao.
              </p>
            </>
          )}
        </aside>
      </form>
    </>
  );
}
