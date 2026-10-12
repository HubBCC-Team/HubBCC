/* ---------------------------------------------------------------------------
   pages/perfil/Perfil.jsx
   TELA 22 - Perfil ("/app/perfil").
   Dados do usuario, estatisticas, preferencias, reset e sair.

   TANSTACK QUERY:
   - useResumoHoras / useAgendamentos -> "Meus numeros"
   - useAtualizarPerfil (useMutation) -> telefone e banner agora sao GRAVADOS
     no db.json (antes ficavam so no navegador)
   - useResetarDados    (useMutation) -> POST /dev/reset e recarrega o cache
   REACT HOOK FORM + ZOD: edicao do telefone (contatoSchema).
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, IdCard, GraduationCap, LogOut, RotateCcw, Camera } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useToast } from "../../contexts/useToast";
import { useResumoHoras, useAgendamentos, useAtualizarPerfil, useResetarDados } from "../../queries";
import { contatoSchema } from "../../schemas/perfilSchemas";
import Cabecalho from "../../components/ui/Cabecalho";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Avatar from "../../components/ui/Avatar";
import Selo from "../../components/ui/Selo";
import { Carregando, Erro } from "../../components/ui/Estado";

const GRADIENTES = [
  "bg-gradient-to-r from-marca-600 to-noite-900", // Padrao
  "bg-gradient-to-r from-emerald-400 to-emerald-800",
  "bg-gradient-to-r from-blue-400 to-violet-600",
  "bg-gradient-to-r from-rose-400 to-orange-500",
];

export default function Perfil() {
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();
  const toast = useToast();

  const horas = useResumoHoras(usuario?.id);
  const agendamentos = useAgendamentos(usuario?.id);
  const atualizar = useAtualizarPerfil();
  const resetar = useResetarDados();

  const [editando, setEditando] = useState(false);
  const [mostrandoGradientes, setMostrandoGradientes] = useState(false);
  // Preferencias de notificacao (apenas visuais no mock).
  const [notificacoes, setNotificacoes] = useState({ email: true, lembretes: true });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contatoSchema),
    defaultValues: { telefone: usuario?.telefone ?? "" },
  });

  if (horas.isLoading || agendamentos.isLoading) return <Carregando />;
  if (horas.isError) return <Erro mensagem={horas.error.message} aoTentarNovamente={horas.refetch} />;

  const resumo = horas.data ?? { horasAprovadas: 0, percentual: 0, totalAtividades: 0 };
  const realizados = (agendamentos.data ?? []).filter((a) => a.situacao === "Realizado").length;
  const bannerAtual = usuario.banner || GRADIENTES[0];

  function iniciarEdicao() {
    reset({ telefone: usuario.telefone ?? "" });
    setEditando(true);
  }

  function salvarContato({ telefone }) {
    atualizar.mutate(
      { telefone },
      {
        onSuccess: () => {
          toast.sucesso("Contato atualizado!");
          setEditando(false);
        },
        onError: (e) => toast.erro(e.message),
      }
    );
  }

  function alterarBanner(gradiente) {
    setMostrandoGradientes(false);
    atualizar.mutate({ banner: gradiente }, { onError: (e) => toast.erro(e.message) });
  }

  function aoResetar() {
    if (!confirm("Isso restaura todos os dados de teste do db.json. Continuar?")) return;
    resetar.mutate(undefined, {
      onSuccess: () => toast.sucesso("Dados de teste restaurados."),
      onError: (e) => toast.erro(e.message),
    });
  }

  function aoSair() {
    sair();
    navegar("/login");
  }

  return (
    <>
      <Cabecalho titulo="Perfil" subtitulo="Seus dados e preferencias no HubBCC" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Identificacao com banner */}
          <div className="cartao overflow-hidden">
            <div className={`relative h-[140px] w-full ${bannerAtual}`}>
              <button
                type="button"
                onClick={() => setMostrandoGradientes(!mostrandoGradientes)}
                className="absolute bottom-3 right-3 rounded-full bg-black/20 p-2.5 text-white backdrop-blur transition-colors hover:bg-black/40"
                aria-label="Trocar banner"
              >
                <Camera size={16} />
              </button>

              {mostrandoGradientes && (
                <div className="anim-surgir absolute bottom-14 right-3 flex gap-2 rounded-xl bg-white p-2 shadow-lg">
                  {GRADIENTES.map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => alterarBanner(grad)}
                      className={`h-8 w-8 rounded-full ${grad} border-2 transition-all ${
                        bannerAtual === grad
                          ? "scale-110 border-marca-600 shadow-sm"
                          : "border-transparent hover:scale-105"
                      }`}
                      aria-label="Selecionar gradiente"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="relative -mt-10 shrink-0 rounded-full border-4 border-white bg-white">
                  <Avatar iniciais={usuario.iniciais} tamanho="grande" />
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <h2 className="text-lg font-bold text-slate-900">{usuario.nome}</h2>
                  <p className="text-xs text-slate-500">{usuario.curso}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Selo tom="marca">{usuario.periodo}</Selo>
                <Selo className="capitalize">{usuario.perfil}</Selo>
              </div>
            </div>
          </div>

          {/* Contato (React Hook Form + Zod) */}
          <form onSubmit={handleSubmit(salvarContato)} noValidate className="cartao p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="titulo-secao">Dados de contato</h2>
              {editando ? (
                <div className="flex gap-1">
                  <Botao type="button" variante="texto" tamanho="pequeno" onClick={() => setEditando(false)}>
                    Cancelar
                  </Botao>
                  <Botao type="submit" variante="texto" tamanho="pequeno" carregando={atualizar.isPending}>
                    Salvar
                  </Botao>
                </div>
              ) : (
                <Botao type="button" variante="texto" tamanho="pequeno" onClick={iniciarEdicao}>
                  Editar
                </Botao>
              )}
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Linha icone={Mail} rotulo="E-mail" valor={usuario.email} />
              <Linha icone={IdCard} rotulo="Matricula" valor={usuario.matricula} />
              <Linha icone={GraduationCap} rotulo="Periodo" valor={usuario.periodo} />
              <div className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <dt className="text-[11px] text-slate-500">Telefone</dt>
                  {editando ? (
                    <Campo
                      className="mt-1"
                      type="tel"
                      placeholder="(21) 90000-0000"
                      erro={errors.telefone?.message}
                      {...register("telefone")}
                    />
                  ) : (
                    <dd className="text-xs font-medium text-slate-800">{usuario.telefone || "-"}</dd>
                  )}
                </div>
              </div>
            </dl>
          </form>

          {/* Notificacoes */}
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

        {/* Coluna lateral */}
        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-4">Meus numeros</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Numero valor={realizados} rotulo="Atendimentos" />
              <Numero valor={resumo.totalAtividades} rotulo="Atividades" />
              <Numero valor={`${resumo.horasAprovadas}h`} rotulo="Horas" />
              <Numero valor={`${resumo.percentual}%`} rotulo="Da meta" />
            </div>
          </div>

          <div className="cartao space-y-2 p-5">
            <Botao variante="contorno" larguraTotal onClick={aoResetar} carregando={resetar.isPending}>
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
