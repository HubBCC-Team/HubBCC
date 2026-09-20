/* ---------------------------------------------------------------------------
   pages/atividades/AtividadesHoras.jsx
   TELA 21 — Atividades & Horas ("/app/atividades").

   Caso de uso 20 (consultar atividades e horas) + exclusao.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, FileText } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarAtividades, resumoHoras, excluirAtividade } from "../../service/atividadeService";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { SeloSituacao } from "../../components/ui/Selo";
import { ProgressoCircular, BarraProgresso } from "../../components/ui/Progresso";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

const CATEGORIAS = ["Todas", "Ensino", "Pesquisa", "Extensao", "Evento"];

export default function AtividadesHoras() {
  const { usuario } = useAuth();
  const [categoria, setCategoria] = useState("Todas");

  const atividades = useRequisicao(
    () => listarAtividades(usuario.id, categoria === "Todas" ? {} : { categoria }),
    [usuario.id, categoria],
    []
  );
  const resumo = useRequisicao(() => resumoHoras(usuario.id), [usuario.id], null);

  async function aoExcluir(id) {
    if (!confirm("Deseja excluir esta atividade?")) return;
    await excluirAtividade(id);
    // Recarrega a lista E o resumo, porque o total de horas muda.
    atividades.recarregar();
    resumo.recarregar();
  }

  if (atividades.carregando || resumo.carregando) return <Carregando />;
  if (atividades.erro) return <Erro mensagem={atividades.erro} aoTentarNovamente={atividades.recarregar} />;

  return (
    <>
      <Cabecalho
        titulo="Atividades & Horas"
        subtitulo="Registre seus certificados e acompanhe as horas complementares"
      >
        <Botao as={Link} to="/app/atividades/nova">
          <Plus size={14} /> Registrar atividade
        </Botao>
      </Cabecalho>

      {/* ----------------------- Paineis de resumo ----------------------- */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="cartao p-5">
          <p className="text-[11px] text-slate-500">Horas aprovadas</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {resumo.dados.horasAprovadas}
            <span className="text-base font-normal text-slate-400">h</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Meta: {resumo.dados.meta}h</p>
          <div className="mt-3">
            <BarraProgresso percentual={resumo.dados.percentual} cor="bg-sucesso" />
          </div>
        </div>

        <div className="cartao flex items-center justify-center p-5">
          <ProgressoCircular
            percentual={resumo.dados.percentual}
            legenda={`Faltam ${Math.max(0, resumo.dados.meta - resumo.dados.horasAprovadas)}h`}
          />
        </div>

        {/* Distribuicao por categoria */}
        <div className="cartao p-5">
          <p className="titulo-secao mb-3">Por categoria</p>
          <ul className="space-y-2.5">
            {Object.entries(resumo.dados.porCategoria).map(([nome, horas]) => (
              <li key={nome}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-slate-600">{nome}</span>
                  <span className="font-medium text-slate-800">{horas}h</span>
                </div>
                {/* Percentual em relacao a meta total */}
                <BarraProgresso percentual={(horas / resumo.dados.meta) * 100} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --------------------- Filtro por categoria --------------------- */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIAS.map((nome) => (
          <button
            key={nome}
            type="button"
            onClick={() => setCategoria(nome)}
            className={[
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              categoria === nome
                ? "bg-marca-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {nome}
          </button>
        ))}
      </div>

      {/* --------------------------- Tabela --------------------------- */}
      <div className="cartao overflow-hidden">
        {atividades.dados.length === 0 ? (
          <Vazio
            titulo="Nenhuma atividade registrada"
            descricao="Registre certificados de eventos, cursos, monitorias e projetos."
            acao={
              <Botao as={Link} to="/app/atividades/nova" tamanho="pequeno">
                Registrar atividade
              </Botao>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Atividade</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 font-medium">Horas</th>
                  <th className="px-5 py-3 font-medium">Situacao</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atividades.dados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-800">{item.titulo}</td>
                    <td className="px-5 py-3 text-slate-500">{item.categoria}</td>
                    <td className="px-5 py-3 text-slate-500">{formatarData(item.data)}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{item.horas}h</td>
                    <td className="px-5 py-3">
                      <SeloSituacao situacao={item.situacao} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-3 text-slate-400">
                        <button type="button" title={item.comprovante} className="hover:text-marca-700">
                          <FileText size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => aoExcluir(item.id)}
                          className="hover:text-erro"
                          aria-label="Excluir atividade"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
