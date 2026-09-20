/* ---------------------------------------------------------------------------
   pages/oportunidades/DetalheOportunidade.jsx
   TELA 8 — Detalhe da oportunidade (rota "/app/oportunidades/:id").

   useParams() le o ":id" da URL. Com ele buscamos a oportunidade no service.
--------------------------------------------------------------------------- */
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Users, Wallet, Clock } from "lucide-react";
import { useRequisicao } from "../../hooks/useRequisicao";
import { buscarOportunidade, encerrarOportunidade } from "../../service/oportunidadeService";
import { useAuth } from "../../contexts/useAuth";
import Botao from "../../components/ui/Botao";
import Selo, { SeloSituacao } from "../../components/ui/Selo";
import { Carregando, Erro } from "../../components/ui/Estado";
import { formatarData } from "../../utils/formatadores";

export default function DetalheOportunidade() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();

  const { dados: item, carregando, erro, recarregar } = useRequisicao(
    () => buscarOportunidade(id),
    [id],
    null
  );

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!item) return null;

  const aberta = item.situacao === "Aberta";

  // Encerrar e uma acao de quem publicou (aqui: monitor/admin) — caso de uso 5.
  async function aoEncerrar() {
    if (!confirm("Deseja realmente encerrar esta oportunidade?")) return;
    await encerrarOportunidade(item.id);
    recarregar();
  }

  return (
    <>
      {/* Voltar: navegar(-1) volta uma pagina no historico do navegador */}
      <button
        onClick={() => navegar(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-marca-700"
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ----------------------- Coluna principal ----------------------- */}
        <div className="space-y-4 lg:col-span-2">
          <div className="cartao p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Selo tom="marca">{item.tipo}</Selo>
              <SeloSituacao situacao={item.situacao} />
              <Selo>{item.modalidade}</Selo>
            </div>

            <h1 className="text-xl font-semibold text-slate-900">{item.titulo}</h1>
            <p className="mt-1 text-xs text-slate-500">
              {item.departamento} · {item.responsavel}
            </p>

            <h2 className="titulo-secao mt-6">Sobre a oportunidade</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.descricao}</p>

            <h2 className="titulo-secao mt-6">Requisitos</h2>
            <ul className="mt-2 space-y-1.5">
              {item.requisitos.map((requisito) => (
                <li key={requisito} className="flex gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-marca-500" />
                  {requisito}
                </li>
              ))}
            </ul>

            <h2 className="titulo-secao mt-6">Atividades previstas</h2>
            <ul className="mt-2 space-y-1.5">
              {item.atividades.map((atividade) => (
                <li key={atividade} className="flex gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {atividade}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* -------------------------- Coluna lateral -------------------------- */}
        <aside className="space-y-4">
          <div className="cartao p-5">
            <h2 className="titulo-secao mb-3">Informacoes</h2>
            <dl className="space-y-3 text-xs">
              <Linha icone={Wallet} rotulo="Bolsa" valor={item.bolsa} />
              <Linha icone={Clock} rotulo="Carga horaria" valor={item.cargaHoraria} />
              <Linha icone={Users} rotulo="Vagas" valor={`${item.vagas} vaga(s)`} />
              <Linha icone={MapPin} rotulo="Local" valor={item.local} />
              <Linha icone={CalendarDays} rotulo="Inscricoes ate" valor={formatarData(item.prazoInscricao)} />
            </dl>

            {/* Caso de uso 6: candidatar-se (so quando a vaga esta aberta) */}
            {aberta ? (
              <Botao
                as={Link}
                to={`/app/oportunidades/${item.id}/candidatura`}
                larguraTotal
                className="mt-5"
              >
                Candidatar-se
              </Botao>
            ) : (
              // Quando encerrada, mostramos um botao desabilitado no lugar do link.
              <Botao larguraTotal className="mt-5" disabled>
                Inscricoes encerradas
              </Botao>
            )}

            {/* Acoes de gestao: so monitor e admin enxergam */}
            {["monitor", "admin"].includes(usuario.perfil) && aberta && (
              <Botao variante="perigo" larguraTotal className="mt-2" onClick={aoEncerrar}>
                Encerrar oportunidade
              </Botao>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

// Linha de "icone + rotulo + valor" da coluna lateral.
function Linha({ icone: Icone, rotulo, valor }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icone size={14} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <dt className="text-[11px] text-slate-500">{rotulo}</dt>
        <dd className="font-medium text-slate-800">{valor}</dd>
      </div>
    </div>
  );
}
