/* ---------------------------------------------------------------------------
   pages/apoio/CriarOferta.jsx
   TELA 14 — Criar oferta de apoio ("/app/apoio/nova").

   Caso de uso 9 (prioridade 4 do projeto — Samuel).

   DESTAQUE: a grade de horarios.
   Guardamos os horarios marcados em um array "horarios". Cada item tem
   { id, dia, inicio, fim }. Clicar em uma celula adiciona ou remove o item.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useFormulario } from "../../hooks/useFormulario";
import { useRequisicao } from "../../hooks/useRequisicao";
import { listarDisciplinas, criarOferta } from "../../service/apoioService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import { iniciaisDe } from "../../utils/formatadores";

const DIAS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta"];
const FAIXAS = ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"];

export default function CriarOferta() {
  const navegar = useNavigate();
  const { usuario } = useAuth();

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

  // Horarios selecionados na grade.
  const [horarios, setHorarios] = useState([]);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Marca/desmarca uma celula da grade.
  function alternarHorario(dia, inicio) {
    // Chave unica para identificar a celula (ex.: "Segunda-14:00").
    const chave = `${dia}-${inicio}`;
    const jaSelecionado = horarios.some((h) => h.id === chave);

    if (jaSelecionado) {
      setHorarios(horarios.filter((h) => h.id !== chave));
    } else {
      // Fim = inicio + 2h (regra simples adotada no projeto).
      const fim = `${String(Number(inicio.slice(0, 2)) + 2).padStart(2, "0")}:00`;
      setHorarios([...horarios, { id: chave, dia, inicio, fim }]);
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);

    if (horarios.length === 0) {
      return setErro("Selecione ao menos um horario de atendimento.");
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
      navegar("/app/apoio");
    } catch (e) {
      setErro(e.message);
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

      {erro && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* ----------------------- Dados da oferta ----------------------- */}
          <div className="cartao space-y-4 p-6">
            <h2 className="titulo-secao">Dados da oferta</h2>

            <Campo rotulo="Titulo" name="titulo" required placeholder="Ex.: Tutoria de Calculo I" value={valores.titulo} onChange={aoMudar} />

            <div className="grid gap-3 sm:grid-cols-2">
              <CampoSelecao
                rotulo="Disciplina"
                name="disciplinaId"
                required
                placeholder="Selecione"
                // Converte a lista de disciplinas no formato { valor, texto }
                opcoes={disciplinas.dados.map((d) => ({ valor: d.id, texto: `${d.codigo} - ${d.nome}` }))}
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

            <Campo rotulo="Assuntos abordados" name="assunto" required placeholder="Ex.: Limites, derivadas e integrais" value={valores.assunto} onChange={aoMudar} />

            <div className="grid gap-3 sm:grid-cols-3">
              <CampoSelecao
                rotulo="Modalidade"
                name="modalidade"
                opcoes={["Presencial", "Remoto", "Hibrido"]}
                value={valores.modalidade}
                onChange={aoMudar}
              />
              <Campo rotulo="Local / link" name="local" required value={valores.local} onChange={aoMudar} />
              <Campo rotulo="Vagas" name="vagas" type="number" min="1" value={valores.vagas} onChange={aoMudar} />
            </div>

            <CampoTexto rotulo="Descricao" name="descricao" linhas={4} value={valores.descricao} onChange={aoMudar} />
          </div>

          {/* --------------------- Grade de horarios --------------------- */}
          <div className="cartao p-6">
            <h2 className="titulo-secao">Disponibilidade semanal</h2>
            <p className="mb-4 mt-1 text-[11px] text-slate-500">
              Clique nos horarios em que voce pode atender. Cada bloco dura 2 horas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-center text-[11px]">
                <thead>
                  <tr>
                    <th className="w-16" />
                    {DIAS.map((dia) => (
                      <th key={dia} className="pb-2 font-medium text-slate-600">
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAIXAS.map((faixa) => (
                    <tr key={faixa}>
                      <td className="pr-2 text-right text-slate-500">{faixa}</td>
                      {DIAS.map((dia) => {
                        const selecionado = horarios.some((h) => h.id === `${dia}-${faixa}`);
                        return (
                          <td key={dia} className="p-1">
                            <button
                              type="button"
                              onClick={() => alternarHorario(dia, faixa)}
                              className={[
                                "h-8 w-full rounded-md border transition",
                                selecionado
                                  ? "border-marca-600 bg-marca-600 text-white"
                                  : "border-slate-200 bg-white hover:bg-slate-50",
                              ].join(" ")}
                              aria-label={`${dia} as ${faixa}`}
                            >
                              {selecionado ? "✓" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

            {/* O campo de valor so aparece quando NAO e gratuito */}
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
              <p className="mt-1">{horarios.length} horario(s) selecionado(s)</p>
              <p>{valores.vagas} vaga(s) por horario</p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={enviando}>
              Publicar oferta
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
