/* ---------------------------------------------------------------------------
   pages/apoio/CriarOferta.jsx
   TELA 14 — Criar oferta de apoio ("/app/apoio/nova").
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useFormulario } from "../../hooks/useFormulario";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarDisciplinas, criarOferta } from "../../service/apoioService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import GradeHorarios from "../../components/ui/GradeHorarios";
import { iniciaisDe } from "../../utils/formatadores";

export default function CriarOferta() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const toast = useToast();

  const disciplinas = useRequisicao(listarDisciplinas, [], []);

  const { valores, aoMudar } = useFormulario({
    titulo: "",
    disciplinaId: "",
    assunto: "",
    tipo: "Tutoria",
    modalidade: "Presencial",
    local: "",
    vagas: 4,
    gratuita: true,
    valor: 0,
    descricao: "",
  });

  const [horarios, setHorarios] = useState([]);
  const [enviando, setEnviando] = useState(false);

  function alternarHorario(dia, inicio) {
    const chave = `${dia}-${inicio}`;
    const jaSelecionado = horarios.some((h) => h.id === chave);

    if (jaSelecionado) {
      setHorarios(horarios.filter((h) => h.id !== chave));
    } else {
      const fim = `${String(Number(inicio.slice(0, 2)) + 2).padStart(2, "0")}:00`;
      setHorarios([...horarios, { id: chave, dia, inicio, fim }]);
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    if (horarios.length === 0) {
      return toast.erro("Selecione ao menos um horario de atendimento.");
    }

    setEnviando(true);
    try {
      await criarOferta({
        ...valores,
        vagas: Number(valores.vagas),
        valor: valores.gratuita ? 0 : Number(valores.valor),
        monitorId: usuario.id,
        monitor: usuario.nome,
        iniciais: iniciaisDe(usuario.nome),
        horarios,
      });
      toast.sucesso("Oferta criada com sucesso!");
      navegar("/app/apoio");
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Cabecalho
        titulo="Criar oferta de apoio"
        subtitulo="Ofereca monitoria ou tutoria para outros alunos do curso"
      />

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* ----------------------- Dados da oferta ----------------------- */}
          <div className="cartao space-y-4 p-6">
            <h2 className="titulo-secao">Dados da oferta</h2>

            <Campo
              rotulo="Titulo"
              name="titulo"
              required
              placeholder="Ex.: Tutoria de Calculo I"
              value={valores.titulo}
              onChange={aoMudar}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <CampoSelecao
                rotulo="Disciplina"
                name="disciplinaId"
                required
                placeholder="Selecione"
                opcoes={disciplinas.dados.map((d) => ({
                  valor: d.id,
                  texto: `${d.codigo} - ${d.nome}`,
                }))}
                value={valores.disciplinaId}
                onChange={aoMudar}
              />
              <CampoSelecao
                rotulo="Tipo"
                name="tipo"
                opcoes={["Monitoria", "Tutoria"]}
                value={valores.tipo}
                onChange={aoMudar}
              />
            </div>

            <Campo
              rotulo="Assuntos abordados"
              name="assunto"
              required
              placeholder="Ex.: Limites, derivadas e integrais"
              value={valores.assunto}
              onChange={aoMudar}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <CampoSelecao
                rotulo="Modalidade"
                name="modalidade"
                opcoes={["Presencial", "Remoto", "Hibrido"]}
                value={valores.modalidade}
                onChange={aoMudar}
              />
              <Campo
                rotulo="Local / link"
                name="local"
                required
                value={valores.local}
                onChange={aoMudar}
              />
              <Campo
                rotulo="Vagas"
                name="vagas"
                type="number"
                min="1"
                value={valores.vagas}
                onChange={aoMudar}
              />
            </div>

            <CampoTexto
              rotulo="Descricao"
              name="descricao"
              linhas={4}
              value={valores.descricao}
              onChange={aoMudar}
            />
          </div>

          {/* --------------------- Grade de horarios --------------------- */}
          {/* Aviso apenas visível em telemóveis (md:hidden) para alertar sobre o scroll */}
          <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500 md:hidden">
            <ArrowLeftRight size={12} className="shrink-0" />
            <p>Arraste a tabela para o lado para ver mais horários</p>
          </div>
          <GradeHorarios horarios={horarios} aoAlterar={alternarHorario} />
        </div>

        {/* -------------------------- Coluna lateral -------------------------- */}
        <aside className="space-y-4">
          <div className="cartao space-y-4 p-5">
            <h2 className="titulo-secao">Valor do atendimento</h2>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                name="gratuita"
                checked={valores.gratuita}
                onChange={aoMudar}
                className="rounded border-slate-300"
              />
              Atendimento gratuito
            </label>

            {!valores.gratuita && (
              <Campo
                rotulo="Valor por atendimento (R$)"
                name="valor"
                type="number"
                min="0"
                step="5"
                value={valores.valor}
                onChange={aoMudar}
              />
            )}

            <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
              <p className="font-medium text-slate-800">Resumo</p>
              <p className="mt-1">
                {horarios.length} horario(s) selecionado(s)
              </p>
              <p>{valores.vagas} vaga(s) por horario</p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={enviando}>
              Publicar oferta
            </Botao>
            <Botao
              type="button"
              variante="contorno"
              larguraTotal
              onClick={() => navegar(-1)}
            >
              Cancelar
            </Botao>
          </div>
        </aside>
      </form>
    </>
  );
}
