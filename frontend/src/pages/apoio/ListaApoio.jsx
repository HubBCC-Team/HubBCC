/* ---------------------------------------------------------------------------
   pages/apoio/ListaApoio.jsx
   TELA 12 - Apoio Academico / lista de monitorias e tutorias ("/app/apoio").
   Casos de uso 10 (consultar ofertas) e 11 (filtrar ofertas).

   TANSTACK QUERY:
   - useDisciplinas()     -> botoes de filtro por disciplina (cache infinito)
   - useOfertas(filtros)  -> os filtros fazem parte da chave: ao mudar,
     busca sozinho; a lista anterior fica na tela enquanto a nova chega.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, MapPin, Users, Loader2 } from "lucide-react";
import { useOfertas, useDisciplinas } from "../../queries";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import Avatar from "../../components/ui/Avatar";
import Estrelas from "../../components/ui/Estrelas";
import Skeleton from "../../components/ui/Skeleton";
import { Erro, Vazio } from "../../components/ui/Estado";
import { formatarValor } from "../../utils/formatadores";

const FILTROS_VAZIOS = { busca: "", disciplinaId: "", tipo: "", modalidade: "", gratuita: "" };

export default function ListaApoio() {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);

  const { data: disciplinas = [] } = useDisciplinas();
  const { data: ofertas = [], isLoading, isFetching, isError, error, refetch } = useOfertas(filtros);

  function mudarFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  const temFiltro = Object.values(filtros).some(Boolean);

  return (
    // anim-surgir aqui: a pagina inteira entra com o fade-in padrao ao abrir.
    <div className="anim-surgir">
      <Cabecalho titulo="Apoio Academico" subtitulo="Monitorias oficiais e tutorias oferecidas por outros alunos">
        <Botao as={Link} to="/app/apoio/nova">
          <Plus size={14} /> Criar oferta
        </Botao>
      </Cabecalho>

      {/* Busca + filtros rapidos */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="search"
            value={filtros.busca}
            onChange={(e) => mudarFiltro("busca", e.target.value)}
            placeholder="Buscar por disciplina, titulo ou monitor..."
            className="campo pl-9"
          />
          {isFetching && !isLoading && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
          )}
        </div>

        <select className="campo w-auto" value={filtros.tipo} onChange={(e) => mudarFiltro("tipo", e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="Monitoria">Monitoria</option>
          <option value="Tutoria">Tutoria</option>
        </select>

        <select
          className="campo w-auto"
          value={filtros.modalidade}
          onChange={(e) => mudarFiltro("modalidade", e.target.value)}
        >
          <option value="">Todas as modalidades</option>
          <option value="Presencial">Presencial</option>
          <option value="Remoto">Remoto</option>
          <option value="Hibrido">Hibrido</option>
        </select>

        {/* Botao que alterna entre "so gratuitas" e "todas" */}
        <button
          type="button"
          onClick={() => mudarFiltro("gratuita", filtros.gratuita === "true" ? "" : "true")}
          className={[
            "rounded-lg px-3 py-2 text-xs font-medium transition",
            filtros.gratuita === "true"
              ? "bg-marca-600 text-white"
              : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          Somente gratuitas
        </button>
      </div>

      {/* Filtro por disciplina (caso de uso 11) */}
      <div className="mb-5 flex flex-wrap gap-2">
        <BotaoDisciplina ativo={filtros.disciplinaId === ""} onClick={() => mudarFiltro("disciplinaId", "")}>
          Todas as disciplinas
        </BotaoDisciplina>
        {disciplinas.map((disciplina) => (
          <BotaoDisciplina
            key={disciplina.id}
            ativo={String(filtros.disciplinaId) === String(disciplina.id)}
            onClick={() => mudarFiltro("disciplinaId", String(disciplina.id))}
          >
            {disciplina.nome}
          </BotaoDisciplina>
        ))}
      </div>

      {/* Resultados */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton variante="cartao" className="h-52" />
          <Skeleton variante="cartao" className="h-52" />
          <Skeleton variante="cartao" className="h-52 hidden md:block" />
        </div>
      ) : isError ? (
        <Erro mensagem={error.message} aoTentarNovamente={refetch} />
      ) : ofertas.length === 0 ? (
        <Vazio
          titulo="Nenhuma oferta encontrada"
          descricao="Ajuste os filtros ou crie voce mesmo uma oferta de apoio."
          acao={
            temFiltro ? (
              <Botao variante="contorno" tamanho="pequeno" onClick={() => setFiltros(FILTROS_VAZIOS)}>
                Limpar filtros
              </Botao>
            ) : (
              <Botao as={Link} to="/app/apoio/nova" tamanho="pequeno">
                Criar oferta
              </Botao>
            )
          }
        />
      ) : (
        <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {/* indice usado so para a cascata (animationDelay) de cada card */}
          {ofertas.map((oferta, indice) => (
            <CartaoOferta key={oferta.id} oferta={oferta} indice={indice} />
          ))}
        </div>
      )}
    </div>
  );
}

function BotaoDisciplina({ ativo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1.5 text-[11px] font-medium transition",
        ativo ? "bg-noite-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CartaoOferta({ oferta, indice = 0 }) {
  // Calcula as vagas restantes para avisar quando estiver lotada.
  const vagasRestantes = oferta.vagas - (oferta.vagasOcupadas ?? 0);
  const lotada = vagasRestantes <= 0;

  return (
    <div
      className="cartao anim-surgir flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${indice * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <Avatar iniciais={oferta.iniciais} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">{oferta.titulo}</h3>
          <p className="text-[11px] text-slate-500">{oferta.monitor}</p>
        </div>
        <Selo tom={oferta.tipo === "Monitoria" ? "marca" : "neutro"}>{oferta.tipo}</Selo>
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-slate-600">{oferta.assunto}</p>

      <div className="mt-3 flex items-center gap-2">
        <Estrelas nota={oferta.nota} mostrarNumero />
        <span className="text-[11px] text-slate-400">({oferta.totalAvaliacoes})</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {oferta.modalidade}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {Math.max(vagasRestantes, 0)} vaga(s) livre(s)
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className={`text-xs font-medium ${oferta.gratuita ? "text-sucesso" : "text-slate-700"}`}>
          {formatarValor(oferta.valor)}
        </span>
        <Botao
          as={Link}
          to={`/app/apoio/${oferta.id}`}
          tamanho="pequeno"
          variante={lotada ? "contorno" : "primario"}
        >
          {lotada ? "Ver detalhes" : "Agendar horario"}
        </Botao>
      </div>
    </div>
  );
}
