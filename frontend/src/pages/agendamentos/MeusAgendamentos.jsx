/* ---------------------------------------------------------------------------
   pages/agendamentos/MeusAgendamentos.jsx
   TELAS 16, 17 e 19 — Meus agendamentos + modal de reagendar + modal de avaliar.

   Casos de uso 15 (consultar), 16 (reagendar/cancelar) e 18 (avaliar).

   Por que os dois modais estao aqui e nao em telas separadas?
   Porque eles abrem por cima desta lista, exatamente como no prototipo. Cada
   modal e um componente separado no final do arquivo, para facilitar a leitura.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import {
  listarAgendamentos,
  cancelarAgendamento,
  reagendar,
  avaliarAtendimento,
} from "../../service/agendamentoService";
import Cabecalho from "../../components/ui/Cabecalho";
import Botao from "../../components/ui/Botao";
import Modal from "../../components/ui/Modal";
import Campo, { CampoTexto } from "../../components/ui/Campo";
import Estrelas from "../../components/ui/Estrelas";
import { SeloSituacao } from "../../components/ui/Selo";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";
import { formatarData, hojeISO } from "../../utils/formatadores";

const ABAS = ["Confirmado", "Realizado", "Cancelado"];

export default function MeusAgendamentos() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState("Confirmado");

  // Guardam qual agendamento esta sendo reagendado/avaliado (null = fechado).
  const [paraReagendar, setParaReagendar] = useState(null);
  const [paraAvaliar, setParaAvaliar] = useState(null);

  const { dados: lista, carregando, erro, recarregar } = useRequisicao(
    () => listarAgendamentos(usuario.id, { situacao: aba }),
    [usuario.id, aba],
    []
  );

  async function aoCancelar(id) {
    if (!confirm("Deseja cancelar este agendamento? A vaga sera liberada.")) return;
    await cancelarAgendamento(id);
    recarregar();
  }

  return (
    <>
      <Cabecalho
        titulo="Meus Agendamentos"
        subtitulo="Acompanhe, reagende ou cancele seus atendimentos"
      >
        <Botao as={Link} to="/app/apoio">
          <Plus size={14} /> Novo agendamento
        </Botao>
      </Cabecalho>

      {/* Abas por situacao */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ABAS.map((nome) => (
          <button
            key={nome}
            type="button"
            onClick={() => setAba(nome)}
            className={[
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              aba === nome
                ? "bg-marca-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {nome}s
          </button>
        ))}
      </div>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} aoTentarNovamente={recarregar} />
      ) : lista.length === 0 ? (
        <Vazio
          titulo={`Nenhum agendamento ${aba.toLowerCase()}`}
          descricao="Procure uma monitoria ou tutoria no Apoio Academico."
          acao={
            <Botao as={Link} to="/app/apoio" tamanho="pequeno">
              Ver ofertas
            </Botao>
          }
        />
      ) : (
        <div className="space-y-3">
          {lista.map((item) => (
            <div
              key={item.id}
              className="cartao flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-marca-600 p-5"
            >
              {/* Bloco da data, a esquerda */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-marca-50 text-marca-700">
                  <span className="text-base font-semibold">{item.data.slice(8, 10)}</span>
                  <span className="text-[10px] uppercase">{mesCurto(item.data)}</span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
                  <p className="text-[11px] text-slate-500">
                    {item.disciplina} · com {item.monitor}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} /> {formatarData(item.data)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {item.hora}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {item.local}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acoes, a direita — variam conforme a situacao */}
              <div className="flex flex-wrap items-center gap-2">
                <SeloSituacao situacao={item.situacao} />

                {item.situacao === "Confirmado" && (
                  <>
                    <Botao
                      variante="contorno"
                      tamanho="pequeno"
                      onClick={() => setParaReagendar(item)}
                    >
                      Reagendar
                    </Botao>
                    <Botao variante="perigo" tamanho="pequeno" onClick={() => aoCancelar(item.id)}>
                      Cancelar
                    </Botao>
                    <Botao
                      as={Link}
                      to={`/app/agendamentos/${item.id}/registrar`}
                      tamanho="pequeno"
                    >
                      Registrar
                    </Botao>
                  </>
                )}

                {/* Avaliar so aparece para atendimento ja realizado e sem nota */}
                {item.situacao === "Realizado" && !item.avaliacao && (
                  <Botao tamanho="pequeno" onClick={() => setParaAvaliar(item)}>
                    Avaliar
                  </Botao>
                )}

                {item.situacao === "Realizado" && item.avaliacao && (
                  <Estrelas nota={item.avaliacao.nota} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------ Modais ------------------------ */}
      <ModalReagendar
        agendamento={paraReagendar}
        aoFechar={() => setParaReagendar(null)}
        aoSalvar={recarregar}
      />
      <ModalAvaliar
        agendamento={paraAvaliar}
        aoFechar={() => setParaAvaliar(null)}
        aoSalvar={recarregar}
      />
    </>
  );
}

/* ---------------------------------------------------------------------------
   TELA 16 — Modal de reagendamento
--------------------------------------------------------------------------- */
function ModalReagendar({ agendamento, aoFechar, aoSalvar }) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function confirmar() {
    setErro(null);
    setEnviando(true);
    try {
      await reagendar(agendamento.id, data, hora);
      aoSalvar();   // recarrega a lista
      aoFechar();   // fecha o modal
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={Boolean(agendamento)} aoFechar={aoFechar} titulo="Reagendar atendimento">
      {agendamento && (
        <>
          <div className="mb-4 rounded-lg bg-slate-50 p-3 text-xs">
            <p className="font-medium text-slate-800">{agendamento.titulo}</p>
            <p className="mt-0.5 text-slate-500">
              Atual: {formatarData(agendamento.data)} as {agendamento.hora}
            </p>
          </div>

          {erro && <p className="mb-3 text-xs text-erro">{erro}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo
              rotulo="Nova data"
              type="date"
              min={hojeISO()} /* impede escolher data passada */
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <Campo
              rotulo="Novo horario"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <Botao variante="contorno" larguraTotal onClick={aoFechar}>
              Voltar
            </Botao>
            <Botao larguraTotal disabled={!data || !hora} carregando={enviando} onClick={confirmar}>
              Confirmar
            </Botao>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ---------------------------------------------------------------------------
   TELA 19 — Modal de avaliacao do atendimento
--------------------------------------------------------------------------- */
const TAGS = ["Didatico", "Pontual", "Paciente", "Claro", "Atencioso"];

function ModalAvaliar({ agendamento, aoFechar, aoSalvar }) {
  const [nota, setNota] = useState(0);
  const [tags, setTags] = useState([]);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Adiciona ou remove uma tag da lista de selecionadas.
  function alternarTag(tag) {
    setTags((atuais) =>
      atuais.includes(tag) ? atuais.filter((t) => t !== tag) : [...atuais, tag]
    );
  }

  async function confirmar() {
    setEnviando(true);
    try {
      await avaliarAtendimento(agendamento.id, { nota, comentario, tags });
      aoSalvar();
      aoFechar();
      // Limpa o formulario para a proxima avaliacao.
      setNota(0);
      setTags([]);
      setComentario("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={Boolean(agendamento)} aoFechar={aoFechar} titulo="Avaliar atendimento">
      {agendamento && (
        <div className="text-center">
          <p className="text-sm text-slate-600">Como foi a monitoria?</p>
          <p className="mt-0.5 text-xs text-slate-400">{agendamento.titulo}</p>

          <div className="my-5 flex justify-center">
            <Estrelas nota={nota} aoSelecionar={setNota} tamanho={30} />
          </div>

          <p className="mb-2 text-[11px] text-slate-500">O que se destacou?</p>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => alternarTag(tag)}
                className={[
                  "rounded-full px-3 py-1 text-[11px] transition",
                  tags.includes(tag)
                    ? "bg-marca-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>

          <CampoTexto
            className="text-left"
            linhas={3}
            placeholder="Deixe um comentario (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <Botao
            larguraTotal
            className="mt-4"
            disabled={nota === 0} /* obriga escolher ao menos 1 estrela */
            carregando={enviando}
            onClick={confirmar}
          >
            Enviar avaliacao
          </Botao>
        </div>
      )}
    </Modal>
  );
}

// "2026-09-22" -> "SET"
function mesCurto(iso) {
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  return meses[Number(iso.slice(5, 7)) - 1];
}
