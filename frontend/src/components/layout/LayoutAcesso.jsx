/* ---------------------------------------------------------------------------
   components/layout/LayoutAcesso.jsx
   Esqueleto das telas de ACESSO (login, cadastro, recuperar senha):
   painel azul a esquerda com a mensagem da marca + formulario a direita.

   O painel azul some em telas pequenas (classe "hidden lg:flex").
--------------------------------------------------------------------------- */
import { Outlet, Link } from "react-router-dom";
import { Compass, CalendarCheck, Award } from "lucide-react";
import Logo from "./Logo";

// Beneficios listados no painel azul. Edite a vontade.
const BENEFICIOS = [
  { icone: Compass, texto: "Encontre oportunidades academicas" },
  { icone: CalendarCheck, texto: "Agende monitorias e tutorias" },
  { icone: Award, texto: "Acompanhe suas horas complementares" },
];

export default function LayoutAcesso() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* ------------------------- Painel azul ------------------------- */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-marca-600 to-noite-900 p-10 lg:flex">
        {/* Circulos decorativos do fundo */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5" />

        <Link to="/" className="relative">
          <Logo tom="claro" />
        </Link>

        <div className="relative">
          <h1 className="text-3xl font-semibold leading-snug text-white">
            Sua jornada
            <br />
            academica em
            <br />
            um so lugar.
          </h1>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Oportunidades, monitorias, agendamentos e atividades complementares
            reunidos no HubBCC.
          </p>

          <ul className="mt-8 space-y-3">
            {BENEFICIOS.map(({ icone: Icone, texto }) => (
              <li key={texto} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <Icone size={14} />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] text-white/40">
          Bacharelado em Ciencia da Computacao
        </p>
      </div>

      {/* --------------------- Area do formulario --------------------- */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
