/* ---------------------------------------------------------------------------
   pages/perfil/Perfil.jsx
   TELA 22 — Perfil ("/app/perfil").

   Mostra os dados do usuario, estatisticas e preferencias. O botao de
   "Resetar dados de teste" so faz sentido enquanto o backend for mockado.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, IdCard, GraduationCap, LogOut, RotateCcw } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useRequisicao } from "../../hooks/useRequisicao";
import { resumoHoras } from "../../service/atividadeService";
import { listarAgendamentos } from "../../service/agendamentoService";
import { resetarDadosDeTeste } from "../../service/authService";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Avatar from "../../components/ui/Avatar";
import Selo from "../../components/ui/Selo";
import { Carregando } from "../../components/ui/Estado";

export default function Perfil() {
  const { usuario, sair, atualizarUsuario } = useAuth();
  const navegar = useNavigate();

  const horas = useRequisicao(() => resumoHoras(usuario.id), [usuario.id], null);
  const agendamentos = useRequisicao(() => listarAgendamentos(usuario.id), [usuario.id], []);

  // Modo edicao dos dados de contato.
  const [editando, setEditando] = useState(false);
  const [telefone, setTelefone] = useState(usuario.telefone ?? "");

  // Preferencias de notificacao (apenas visuais no mock).
  const [notificacoes, setNotificacoes] = useState({ email: true, lembretes: true });

  if (horas.carregando) return <Carregando />;

  function salvarContato() {
    atualizarUsuario({ telefone });
    setEditando(false);
  }

  async function aoResetar() {
    if (!confirm("Isso apaga todos os dados de teste e recarrega a pagina. Continuar?")) return;
    await resetarDadosDeTeste();
    window.location.reload();
  }

  function aoSair() {
    sair();
    navegar("/login");
  }

  const realizados = agendamentos.dados.filter((a) => a.situacao === "Realizado").length;

  return (
    <>
      <Cabecalho titulo="Perfil" subtitulo="Seus dados e preferencias no HubBCC" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* ------------------------ Identificacao ------------------------ */}
          <div className="cartao p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar iniciais={usuario.iniciais} tamanho="grande" />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-slate-900">{usuario.nome}</h2>
                <p className="text-xs text-slate-500">{usuario.curso}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Selo tom="marca">{usuario.periodo}</Selo>
                  <Selo className="capitalize">{usuario.perfil}</Selo>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------- Contato --------------------------- */}
          <div className="cartao p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="titulo-secao">Dados de contato</h2>
              <Botao
                variante="texto"
                tamanho="pequeno"
                onClick={() => (editando ? salvarContato() : setEditando(true))}
              >
                {editando ? "Salvar" : "Editar"}
              </Botao>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Linha icone={Mail} rotulo="E-mail" valor={usuario.email} />
              <Linha icone={IdCard} rotulo="Matricula" valor={usuario.matricula} />
              <Linha icone={GraduationCap} rotulo="Periodo" valor={usuario.periodo} />

              {/* O telefone vira campo editavel quando "editando" e true */}
              <div className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <dt className="text-[11px] text-slate-500">Telefone</dt>
                  {editando ? (
                    <Campo
                      className="mt-1"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  ) : (
                    <dd className="text-xs font-medium text-slate-800">{usuario.telefone || "-"}</dd>
                  )}
                </div>
              </div>
            </dl>
          </div>

          {/* ------------------------ Notificacoes ------------------------ */}
          <div className="cartao p-6">
            <h2 className="titulo-secao mb-4">Notificacoes</h2>
            <div className="space-y-3">
              <Alternador
                rotulo="Receber avisos por e-mail"
                ativo={notificacoes.email}
                aoAlternar={() => setNotificacoes((n) => ({ ...n, email: !n.email }))}
              />
              <Alternador
                rotulo="Lembrete 1 hora antes do atendimento"
                ativo={notificacoes.lembretes}
                aoAlternar={() => setNotificacoes((n) => ({ ...n, lembretes: !n.lembretes }))}
              />
            </div>
          </div>
        </div>

        {/* --------------------------- Coluna lateral --------------------------- */}
        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-4">Meus numeros</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Numero valor={realizados} rotulo="Atendimentos" />
              <Numero valor={horas.dados.totalAtividades} rotulo="Atividades" />
              <Numero valor={`${horas.dados.horasAprovadas}h`} rotulo="Horas" />
              <Numero valor={`${horas.dados.percentual}%`} rotulo="Da meta" />
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            {/* Botao util so no modo mock — remova quando houver backend real */}
            <Botao variante="contorno" larguraTotal onClick={aoResetar}>
              <RotateCcw size={14} /> Resetar dados de teste
            </Botao>
            <Botao variante="perigo" larguraTotal onClick={aoSair}>
              <LogOut size={14} /> Sair da conta
            </Botao>
          </div>
        </aside>
      </div>
    </>
  );
}

function Linha({ icone: Icone, rotulo, valor }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icone size={15} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <dt className="text-[11px] text-slate-500">{rotulo}</dt>
        <dd className="text-xs font-medium text-slate-800">{valor}</dd>
      </div>
    </div>
  );
}

function Numero({ valor, rotulo }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-lg font-semibold text-slate-900">{valor}</p>
      <p className="text-[10px] text-slate-500">{rotulo}</p>
    </div>
  );
}

// Interruptor liga/desliga feito so com CSS.
function Alternador({ rotulo, ativo, aoAlternar }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-600">{rotulo}</span>
      <button
        type="button"
        onClick={aoAlternar}
        className={`relative h-5 w-9 rounded-full transition ${ativo ? "bg-marca-600" : "bg-slate-300"}`}
        aria-pressed={ativo}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            ativo ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
