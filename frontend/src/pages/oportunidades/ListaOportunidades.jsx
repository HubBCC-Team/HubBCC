/* ---------------------------------------------------------------------------
   pages/oportunidades/ListaOportunidades.jsx
   TELAS 6 e 7 — Lista de oportunidades + painel de filtros.

   Casos de uso atendidos: 2 (consultar) e 3 (filtrar).

   COMO OS FILTROS FUNCIONAM:
   Guardamos os filtros no estado "filtros". Como ele esta na lista de
   dependencias do useRequisicao, qualquer mudanca dispara uma nova busca
   automaticamente — nao precisa de botao "aplicar" para funcionar.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Users, Plus } from "lucide-react";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarOportunidades } from "../../service/oportunidadeService";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Selo, { SeloSituacao } from "../../components/ui/Selo";
import Modal from "../../components/ui/Modal";
import { CampoSelecao } from "../../components/ui/Campo";
import { Erro, Vazio } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";
import { usePermissao } from "../../hooks/usePermissao";
import Skeleton from "../../components/ui/Skeleton";

// Opcoes dos filtros. Para incluir um novo tipo, adicione aqui e no db.js.
const TIPOS = [
  "Iniciacao Cientifica",
  "Extensao",
  "Evento",
  "Estagio",
  "Monitoria",
];
const MODALIDADES = ["Presencial", "Remoto", "Hibrido"];
const SITUACOES = ["Aberta", "Encerrada"];

// Atalhos de tipo exibidos como "abas" acima da lista.
const ABAS = [
  "Todas",
  "Monitoria",
  "Iniciacao Cientifica",
  "Extensao",
  "Evento",
];

export default function ListaOportunidades() {
  const [parametrosUrl] = useSearchParams();
  const { podeGerenciar } = usePermissao();

  const [filtros, setFiltros] = useState({
    busca: parametrosUrl.get("busca") ?? "",
    tipo: "",
    modalidade: "",
    situacao: "",
  });

  const [painelAberto, setPainelAberto] = useState(false);

  const {
    dados: lista,
    carregando,
    erro,
    recarregar,
  } = useRequisicao(
    () => listarOportunidades(filtros),
    [JSON.stringify(filtros)],
    [],
  );

  function mudarFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function limparFiltros() {
    setFiltros({ busca: "", tipo: "", modalidade: "", situacao: "" });
  }

  return (
    <div className="anim-surgir">
      <Cabecalho
        titulo="Oportunidades Academicas"
        subtitulo="Monitorias, iniciacao cientifica, extensao e eventos do curso"
      >
        {podeGerenciar && (
          <Botao as={Link} to="/app/oportunidades/nova">
            <Plus size={14} /> Cadastrar
          </Botao>
        )}
      </Cabecalho>

      {/* ------------------------- Barra de busca ------------------------- */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={15}
          />
          <input
            type="search"
            value={filtros.busca}
            onChange={(e) => mudarFiltro("busca", e.target.value)}
            placeholder="Buscar por titulo, area ou descricao..."
            className="campo pl-9"
          />
        </div>
        <Botao variante="contorno" onClick={() => setPainelAberto(true)}>
          <SlidersHorizontal size={14} /> Filtros
        </Botao>
      </div>

      {/* ---------------------- Abas de tipo (atalho) ---------------------- */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ABAS.map((aba) => {
          const valor = aba === "Todas" ? "" : aba;
          const ativa = filtros.tipo === valor;
          return (
            <button
              key={aba}
              type="button"
              onClick={() => mudarFiltro("tipo", valor)}
              className={[
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                ativa
                  ? "bg-marca-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              {aba}
            </button>
          );
        })}
      </div>

      {/* ---------------------------- Resultados ---------------------------- */}
      {carregando ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton variante="cartao" className="h-44" />
          <Skeleton variante="cartao" className="h-44" />
          <Skeleton variante="cartao" className="h-44" />
          <Skeleton variante="cartao" className="h-44 hidden md:block" />
          <Skeleton variante="cartao" className="h-44 hidden md:block" />
          <Skeleton variante="cartao" className="h-44 hidden xl:block" />
        </div>
      ) : erro ? (
        <Erro mensagem={erro} aoTentarNovamente={recarregar} />
      ) : lista.length === 0 ? (
        <Vazio
          titulo="Nenhuma oportunidade encontrada"
          descricao="Tente remover alguns filtros ou usar outro termo de busca."
          acao={
            <Botao
              variante="contorno"
              tamanho="pequeno"
              onClick={limparFiltros}
            >
              Limpar filtros
            </Botao>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-slate-500">
            {lista.length} oportunidade(s) encontrada(s)
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lista.map((item, indice) => (
              <CartaoOportunidade key={item.id} item={item} indice={indice} />
            ))}
          </div>
        </>
      )}

      {/* ----------------- TELA 7: painel lateral de filtros ----------------- */}
      <Modal
        aberto={painelAberto}
        aoFechar={() => setPainelAberto(false)}
        titulo="Filtros"
      >
        <div className="space-y-4">
          <CampoSelecao
            rotulo="Tipo de oportunidade"
            placeholder="Todos"
            opcoes={TIPOS}
            value={filtros.tipo}
            onChange={(e) => mudarFiltro("tipo", e.target.value)}
          />
          <CampoSelecao
            rotulo="Modalidade"
            placeholder="Todas"
            opcoes={MODALIDADES}
            value={filtros.modalidade}
            onChange={(e) => mudarFiltro("modalidade", e.target.value)}
          />
          <CampoSelecao
            rotulo="Situacao"
            placeholder="Todas"
            opcoes={SITUACOES}
            value={filtros.situacao}
            onChange={(e) => mudarFiltro("situacao", e.target.value)}
          />

          <div className="flex gap-2 pt-2">
            <Botao variante="contorno" larguraTotal onClick={limparFiltros}>
              Limpar
            </Botao>
            <Botao larguraTotal onClick={() => setPainelAberto(false)}>
              Aplicar filtros
            </Botao>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CartaoOportunidade({ item, indice = 0 }) {
  return (
    <Link
      to={`/app/oportunidades/${item.id}`}
      className="cartao anim-surgir flex flex-col p-5 transition hover:-translate-y-1 hover:border-marca-300 hover:shadow-md"
      style={{ animationDelay: `${indice * 50}ms` }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <Selo tom="marca">{item.tipo}</Selo>
        <SeloSituacao situacao={item.situacao} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">{item.titulo}</h3>
      <p className="mt-1 text-[11px] text-slate-500">{item.departamento}</p>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
        {item.descricao}
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {item.modalidade}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {item.vagas} vaga(s)
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-700">{item.bolsa}</span>
        <span className="text-[11px] text-slate-400">
          Ate {formatarData(item.prazoInscricao)}
        </span>
      </div>
    </Link>
  );
}
