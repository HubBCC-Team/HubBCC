/* ---------------------------------------------------------------------------
   pages/atividades/AtividadesHoras.jsx
   TELA 21 - Atividades & Horas ("/app/atividades"). Caso de uso 20.

   TANSTACK QUERY:
   - useAtividades(usuarioId, filtros) -> lista (a categoria faz parte da chave)
   - useResumoHoras(usuarioId)         -> paineis de progresso
   - useExcluirAtividade()             -> ao excluir, lista E resumo atualizam
     sozinhos (os dois comecam com a chave ["atividades"]).
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, FileText, Pencil, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useAtividades, useResumoHoras, useExcluirAtividade } from "../../queries";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import { SeloSituacao } from "../../components/ui/Selo";
import { ProgressoCircular, BarraProgresso } from "../../components/ui/Progresso";
import { Erro, Vazio } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";
import VisualizadorArquivo from "../../components/ui/VisualizadorArquivo";
import Skeleton from "../../components/ui/Skeleton";

const CATEGORIAS = ["Todas", "Ensino", "Pesquisa", "Extensao", "Evento"];

export default function AtividadesHoras() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [categoria, setCategoria] = useState("Todas");
  const [comprovanteAtivo, setComprovanteAtivo] = useState(null);

  const filtros = categoria === "Todas" ? {} : { categoria };
  const atividades = useAtividades(usuario?.id, filtros);
  const resumo = useResumoHoras(usuario?.id);
  const excluir = useExcluirAtividade();

  function aoExcluir(id) {
    if (!confirm("Deseja excluir esta atividade?")) return;
    excluir.mutate(id, {
      onSuccess: () => toast.sucesso("Atividade excluida com sucesso."),
      onError: (e) => toast.erro(e.message || "Erro ao excluir a atividade."),
    });
  }

  function abrirComprovante(atividade) {
    if (!atividade.comprovanteArquivo) {
      return toast.info("Esta atividade nao possui um arquivo anexado.");
    }
    setComprovanteAtivo(atividade);
  }

  // Primeira carga: esqueleto da pagina inteira.
  if (atividades.isLoading || resumo.isLoading) {
    return (
      <div className="space-y-6 pt-2">
        <div className="space-y-2">
          <Skeleton variante="texto" className="h-8 w-1/3" />
          <Skeleton variante="texto" className="h-4 w-1/2" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton variante="cartao" className="h-40" />
          <Skeleton variante="cartao" className="h-40" />
          <Skeleton variante="cartao" className="h-40" />
        </div>
        <Skeleton variante="linhaTabela" linhas={5} />
      </div>
    );
  }

  if (atividades.isError) {
    return <Erro mensagem={atividades.error.message} aoTentarNovamente={atividades.refetch} />;
  }
  if (resumo.isError) {
    return <Erro mensagem={resumo.error.message} aoTentarNovamente={resumo.refetch} />;
  }

  const lista = atividades.data ?? [];
  const r = resumo.data ?? { horasAprovadas: 0, meta: 200, percentual: 0, porCategoria: {} };

  return (
    <>
      <Cabecalho titulo="Atividades & Horas" subtitulo="Registre seus certificados e acompanhe as horas">
        <Botao as={Link} to="/app/atividades/nova">
          <Plus size={14} /> Registrar
        </Botao>
      </Cabecalho>

      {/* Paineis de resumo */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="cartao p-5">
          <p className="text-[11px] text-slate-500">Horas aprovadas</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {r.horasAprovadas}
            <span className="text-base font-normal text-slate-400">h</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Meta: {r.meta}h</p>
          <div className="mt-3">
            <BarraProgresso percentual={r.percentual} cor="bg-sucesso" />
          </div>
        </div>

        <div className="cartao flex items-center justify-center p-5">
          <ProgressoCircular
            percentual={r.percentual}
            legenda={`Faltam ${Math.max(0, r.meta - r.horasAprovadas)}h`}
          />
        </div>

        <div className="cartao p-5">
          <p className="titulo-secao mb-3">Por categoria</p>
          <ul className="space-y-2.5">
            {Object.entries(r.porCategoria).map(([nome, horas]) => (
              <li key={nome}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-slate-600">{nome}</span>
                  <span className="font-medium text-slate-800">{horas}h</span>
                </div>
                <BarraProgresso percentual={(horas / r.meta) * 100} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
        {atividades.isFetching && <Loader2 size={14} className="animate-spin text-slate-400" />}
      </div>

      {/* Listagem (tabela no desktop, cartoes no mobile) */}
      <div className={`cartao overflow-hidden transition-opacity ${atividades.isFetching ? "opacity-60" : ""}`}>
        {lista.length === 0 ? (
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
          <>
            <div className="hidden overflow-x-auto md:block">
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
                  {lista.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-medium text-slate-800">{item.titulo}</td>
                      <td className="px-5 py-3 text-slate-500">{item.categoria}</td>
                      <td className="px-5 py-3 text-slate-500">{formatarData(item.data)}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{item.horas}h</td>
                      <td className="px-5 py-3">
                        <SeloSituacao situacao={item.situacao} />
                      </td>
                      <td className="px-5 py-3">
                        {acoes(item)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 md:hidden">
              {lista.map((item) => (
                <div key={item.id} className="p-4 transition hover:bg-slate-50/60">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-800">{item.titulo}</h3>
                      <p className="text-[11px] text-slate-500">{item.categoria}</p>
                    </div>
                    <SeloSituacao situacao={item.situacao} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>{formatarData(item.data)}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="font-medium text-slate-700">{item.horas}h</span>
                    </div>
                    {acoes(item)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <VisualizadorArquivo
        aberto={Boolean(comprovanteAtivo)}
        aoFechar={() => setComprovanteAtivo(null)}
        nome={comprovanteAtivo?.comprovante}
        base64={comprovanteAtivo?.comprovanteArquivo}
      />
    </>
  );

  // Botoes de comprovante / editar / excluir (usados na tabela e nos cartoes).
  function acoes(item) {
    const excluindoEste = excluir.isPending && excluir.variables === item.id;
    return (
      <div className="flex shrink-0 gap-3 text-slate-400">
        <button
          type="button"
          title={item.comprovante}
          onClick={() => abrirComprovante(item)}
          className="transition-colors hover:text-marca-700"
          aria-label="Ver comprovante"
        >
          <FileText size={15} />
        </button>

        {item.situacao === "Aprovada" ? (
          <button type="button" disabled title="Atividades aprovadas nao podem ser editadas">
            <Pencil size={15} className="cursor-not-allowed text-slate-300" />
          </button>
        ) : (
          <Link
            to={`/app/atividades/${item.id}/editar`}
            className="text-slate-500 transition hover:text-marca-600"
            title="Editar atividade"
          >
            <Pencil size={15} />
          </Link>
        )}

        <button
          type="button"
          onClick={() => aoExcluir(item.id)}
          disabled={excluir.isPending}
          className="transition-colors hover:text-erro disabled:opacity-50"
          aria-label="Excluir atividade"
        >
          {excluindoEste ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
      </div>
    );
  }
}
