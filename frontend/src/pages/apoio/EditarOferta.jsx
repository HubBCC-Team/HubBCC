/* ---------------------------------------------------------------------------
   pages/apoio/EditarOferta.jsx
   TELA — Editar oferta de apoio (rota "/app/apoio/:id/editar").

   Caso de uso 12. Carrega a oferta com buscarOferta(id) e reaproveita a
   GradeHorarios, ja vindo com os horarios salvos marcados.

   IMPORTANTE (regra dos hooks): so podemos usar useState/useFormulario depois
   que os dados chegaram, entao o componente de fora (EditarOferta) so cuida
   de buscar e mostrar Carregando/Erro; quem de fato tem o formulario e o
   ConteudoEdicao, que so e criado quando a oferta ja existe.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormulario } from "../../hooks/useFormulario";
import { useRequisicao } from "../../hooks/useRequisicao";
import {
  listarDisciplinas,
  buscarOferta,
  alterarOferta,
  cancelarOferta,
} from "../../service/apoioService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo, { CampoSelecao, CampoTexto } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import GradeHorarios from "../../components/ui/GradeHorarios";
import Alerta from "../../components/ui/Alerta";
import { Carregando, Erro } from "../../components/ui/Estado";

export default function EditarOferta() {
  const { id } = useParams();
  const disciplinas = useRequisicao(listarDisciplinas, [], []);

  const { dados: oferta, carregando, erro, recarregar } = useRequisicao(
    () => buscarOferta(id),
    [id],
    null
  );

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!oferta) return null;

  return <ConteudoEdicao id={id} oferta={oferta} disciplinas={disciplinas.dados} />;
}

// Só existe depois que a oferta já chegou — por isso pode usar
// useFormulario/useState com os valores dela sem quebrar a regra dos hooks.
function ConteudoEdicao({ id, oferta, disciplinas }) {
  const navegar = useNavigate();

  const { valores, aoMudar } = useFormulario({
    titulo: oferta.titulo,
    disciplinaId: oferta.disciplinaId,
    assunto: oferta.assunto,
    tipo: oferta.tipo,
    modalidade: oferta.modalidade,
    local: oferta.local,
    vagas: oferta.vagas,
    gratuita: oferta.gratuita,
    valor: oferta.valor,
    descricao: oferta.descricao,
  });

  // Os horarios já vêm salvos: usamos como valor inicial da grade, para
  // que apareçam marcados assim que a tela abre.
  const [horarios, setHorarios] = useState(oferta.horarios);
  const [erro, setErro] = useState(null);
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
    setErro(null);

    if (horarios.length === 0) {
      return setErro("Selecione ao menos um horario de atendimento.");
    }

    setEnviando(true);
    try {
      await alterarOferta(id, {
        ...valores,
        vagas: Number(valores.vagas),
        valor: valores.gratuita ? 0 : Number(valores.valor),
        horarios,
      });
      navegar(`/app/apoio/${id}`);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function aoCancelarOferta() {
    if (!confirm("Deseja realmente cancelar esta oferta? Essa acao nao pode ser desfeita.")) return;
    await cancelarOferta(id);
    navegar("/app/apoio");
  }

  return (
    <>
      <Cabecalho
        titulo="Editar oferta de apoio"
        subtitulo="Atualize os dados e a disponibilidade desta oferta"
      />

      {erro && (
        <Alerta variante="erro" className="mb-4">
          {erro}
        </Alerta>
      )}

      <form onSubmit={aoEnviar} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="cartao space-y-4 p-6">
            <h2 className="titulo-secao">Dados da oferta</h2>

            <Campo rotulo="Titulo" name="titulo" required placeholder="Ex.: Tutoria de Calculo I" value={valores.titulo} onChange={aoMudar} />

            <div className="grid gap-3 sm:grid-cols-2">
              <CampoSelecao
                rotulo="Disciplina"
                name="disciplinaId"
                required
                placeholder="Selecione"
                opcoes={disciplinas.map((d) => ({ valor: d.id, texto: `${d.codigo} - ${d.nome}` }))}
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

          {/* Grade já vem com os horarios salvos marcados, via valor inicial do useState acima */}
          <GradeHorarios horarios={horarios} aoAlterar={alternarHorario} />
        </div>

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
              <p className="mt-1">{horarios.length} horario(s) selecionado(s)</p>
              <p>{valores.vagas} vaga(s) por horario</p>
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao type="submit" larguraTotal carregando={enviando}>
              Salvar alteracoes
            </Botao>
            <Botao type="button" variante="contorno" larguraTotal onClick={() => navegar(-1)}>
              Cancelar edicao
            </Botao>
            <Botao type="button" variante="perigo" larguraTotal onClick={aoCancelarOferta}>
              Cancelar oferta
            </Botao>
          </div>
        </aside>
      </form>
    </>
  );
}
