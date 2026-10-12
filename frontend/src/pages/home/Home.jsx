/* ---------------------------------------------------------------------------
   pages/home/Home.jsx
   TELA 5 - Inicio / Dashboard (rota "/app").
   Saudacao, indicadores, proximos agendamentos e progresso das horas.

   TANSTACK QUERY - tres consultas em paralelo:
     useOportunidades({ situacao: "Aberta" })
     useAgendamentos(usuarioId, { situacao: "Confirmado" })
     useResumoHoras(usuarioId)
   Elas compartilham o cache com as outras telas: ao voltar da lista de
   oportunidades, por exemplo, o numero aparece na hora, sem nova espera.
--------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import { Briefcase, Users, Clock, Award, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useOportunidades, useAgendamentos, useResumoHoras } from "../../queries";
import { ProgressoCircular } from "../../components/ui/Progresso";
import { SeloSituacao } from "../../components/ui/Selo";
import { Carregando, Erro, Vazio } from "../../components/ui/Estado";
import Botao from "../../components/ui/Botao";
import { formatarData } from "../../utils/formatadores";

// Filtros fixos fora do componente: mesma chave de cache a cada render.
const FILTRO_ABERTAS = { situacao: "Aberta" };
const FILTRO_CONFIRMADOS = { situacao: "Confirmado" };

export default function Home() {
  const { usuario } = useAuth();

  const oportunidades = useOportunidades(FILTRO_ABERTAS);
  const agendamentos = useAgendamentos(usuario?.id, FILTRO_CONFIRMADOS);
  const horas = useResumoHoras(usuario?.id);

  // Enquanto qualquer uma ainda nao carregou pela primeira vez.
  if (oportunidades.isLoading || agendamentos.isLoading || horas.isLoading) {
    return <Carregando />;
  }

  // Mostra o primeiro erro encontrado; "Tentar novamente" refaz as tres.
  const comErro = [oportunidades, agendamentos, horas].find((consulta) => consulta.isError);
  if (comErro) {
    return (
      <Erro
        mensagem={comErro.error.message}
        aoTentarNovamente={() => {
          oportunidades.refetch();
          agendamentos.refetch();
          horas.refetch();
        }}
      />
    );
  }

  const listaOportunidades = oportunidades.data ?? [];
  const listaAgendamentos = agendamentos.data ?? [];
  const resumo = horas.data ?? { horasAprovadas: 0, meta: 200, percentual: 0, totalAtividades: 0 };
  const primeiroNome = usuario.nome.split(" ")[0];

  const indicadores = [
    { icone: Briefcase, rotulo: "Oportunidades abertas", valor: listaOportunidades.length },
    { icone: Users, rotulo: "Agendamentos ativos", valor: listaAgendamentos.length },
    { icone: Clock, rotulo: "Horas aprovadas", valor: `${resumo.horasAprovadas}h` },
    { icone: Award, rotulo: "Atividades registradas", valor: resumo.totalAtividades },
  ];

  return (
    <>
      {/* Faixa de boas-vindas */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-marca-600 to-noite-800 p-6 text-white">
        <div>
          <h1 className="text-xl font-semibold">Ola, {primeiroNome}!</h1>
          <p className="mt-1 text-sm text-white/70">
            Voce tem {listaAgendamentos.length} agendamento(s) confirmado(s) e {listaOportunidades.length}{" "}
            oportunidade(s) aberta(s).
          </p>
        </div>
        <Botao as={Link} to="/app/oportunidades" variante="contorno">
          Ver oportunidades
        </Botao>
      </div>

      {/* Indicadores */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map(({ icone: Icone, rotulo, valor }) => (
          <div key={rotulo} className="cartao flex items-center gap-4 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca-50 text-marca-700">
              <Icone size={18} />
            </span>
            <div>
              <p className="text-xl font-semibold text-slate-900">{valor}</p>
              <p className="text-[11px] text-slate-500">{rotulo}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Proximos agendamentos */}
        <div className="cartao p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="titulo-secao">Proximos agendamentos</h2>
            <Link to="/app/agendamentos" className="text-[11px] text-marca-700 hover:underline">
              Ver todos
            </Link>
          </div>

          {listaAgendamentos.length === 0 ? (
            <Vazio
              titulo="Nenhum agendamento confirmado"
              descricao="Encontre uma monitoria ou tutoria e faca seu primeiro agendamento."
              acao={
                <Botao as={Link} to="/app/apoio" tamanho="pequeno">
                  Buscar apoio academico
                </Botao>
              }
            />
          ) : (
            <ul className="space-y-2">
              {listaAgendamentos.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 border-l-4 border-l-marca-600 bg-slate-50/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900">{item.titulo}</p>
                    <p className="text-[11px] text-slate-500">
                      {formatarData(item.data)} · {item.hora} · {item.local}
                    </p>
                  </div>
                  <SeloSituacao situacao={item.situacao} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Horas complementares */}
        <div className="cartao flex flex-col items-center justify-center p-5">
          <h2 className="titulo-secao mb-3 self-start">Horas complementares</h2>
          <ProgressoCircular percentual={resumo.percentual} legenda={`${resumo.horasAprovadas}h de ${resumo.meta}h`} />
          <Botao as={Link} to="/app/atividades/nova" variante="contorno" tamanho="pequeno" className="mt-4 w-full">
            Registrar atividade <ArrowRight size={13} />
          </Botao>
        </div>
      </div>
    </>
  );
}
