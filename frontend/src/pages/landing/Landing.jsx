/* ---------------------------------------------------------------------------
   pages/landing/Landing.jsx
   TELA 1 — Abertura / Landing (rota "/").

   E a unica tela publica com conteudo institucional. Ela apenas apresenta o
   sistema e leva o visitante para /cadastro ou /login. Nao faz chamada de API.
--------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import { CalendarCheck, Star, TrendingUp } from "lucide-react";
import Logo from "../../components/layout/Logo";
import Botao from "../../components/ui/Botao";
import Selo from "../../components/ui/Selo";
import { BarraProgresso } from "../../components/ui/Progresso";

// Numeros exibidos abaixo da chamada principal. Troque a vontade.
const INDICADORES = [
  { valor: "+120", rotulo: "oportunidades" },
  { valor: "35", rotulo: "monitorias ativas" },
  { valor: "98%", rotulo: "satisfacao" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* ------------------------- Barra do topo ------------------------- */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo tom="escuro" />

        {/* Links de ancora: rolam a propria pagina */}
        <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          <a href="#sobre" className="hover:text-marca-700">Sobre</a>
          <a href="#oportunidades" className="hover:text-marca-700">Oportunidades</a>
          <a href="#monitorias" className="hover:text-marca-700">Monitorias</a>
          <a href="#horas" className="hover:text-marca-700">Horas</a>
        </nav>

        <div className="flex items-center gap-2">
          <Botao as={Link} to="/login" variante="texto" tamanho="pequeno">
            Entrar
          </Botao>
          <Botao as={Link} to="/cadastro" tamanho="pequeno">
            Cadastrar
          </Botao>
        </div>
      </header>

      {/* ---------------------------- Destaque ---------------------------- */}
      <section
        id="sobre"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2"
      >
        {/* Coluna da esquerda: texto */}
        <div>
          <Selo tom="marca">Plataforma academica · BCC</Selo>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Conecte-se ao que
            <br />
            importa na sua
            <br />
            <span className="text-marca-600">graduacao.</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Encontre oportunidades academicas, agende monitorias e tutorias com
            outros alunos e acompanhe suas horas complementares — tudo em um
            unico lugar.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Botao as={Link} to="/cadastro" tamanho="grande">
              Comecar agora
            </Botao>
            <Botao as={Link} to="/login" variante="contorno" tamanho="grande">
              Ja tenho conta
            </Botao>
          </div>

          <div className="mt-10 flex gap-10">
            {INDICADORES.map((item) => (
              <div key={item.rotulo}>
                <p className="text-2xl font-semibold text-slate-900">{item.valor}</p>
                <p className="text-[11px] text-slate-500">{item.rotulo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da direita: "print" ilustrativo do sistema */}
        <div className="relative rounded-3xl bg-gradient-to-br from-marca-600 to-noite-900 p-8">
          <div className="space-y-3">
            {/* Mini-card 1: proximo agendamento */}
            <div className="cartao flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-marca-50 text-marca-700">
                <CalendarCheck size={17} />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-900">Monitoria de Calculo I</p>
                <p className="text-[11px] text-slate-500">Segunda, 14:00 · Bloco A</p>
              </div>
            </div>

            {/* Mini-card 2: progresso de horas */}
            <div className="cartao ml-8 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900">Horas complementares</p>
                <span className="text-[11px] text-slate-500">148h / 200h</span>
              </div>
              <BarraProgresso percentual={74} cor="bg-sucesso" />
            </div>

            {/* Mini-card 3: avaliacao */}
            <div className="cartao flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <Star size={17} />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-900">Prof. Ana Ribeiro</p>
                <p className="text-[11px] text-slate-500">4.9 · 24 avaliacoes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- Tres pilares --------------------------- */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {[
            {
              id: "oportunidades",
              icone: TrendingUp,
              titulo: "Oportunidades academicas",
              texto:
                "Iniciacao cientifica, extensao, eventos e monitorias reunidos, com filtro e candidatura pelo proprio sistema.",
            },
            {
              id: "monitorias",
              icone: CalendarCheck,
              titulo: "Monitorias e tutorias",
              texto:
                "Encontre alunos que ja cursaram a disciplina, veja horarios disponiveis e agende seu atendimento.",
            },
            {
              id: "horas",
              icone: Star,
              titulo: "Horas complementares",
              texto:
                "Registre certificados, acompanhe o total de horas e saiba exatamente quanto falta para concluir.",
            },
          ].map(({ id, icone: Icone, titulo, texto }) => (
            <div key={id} id={id} className="cartao p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-marca-50 text-marca-700">
                <Icone size={18} />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-[11px] text-slate-400">
        HubBCC · Projeto academico — Bacharelado em Ciencia da Computacao
      </footer>
    </div>
  );
}
