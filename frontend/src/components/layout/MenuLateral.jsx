/* ---------------------------------------------------------------------------
   components/layout/MenuLateral.jsx
   Barra azul escura da esquerda, presente em todas as telas internas.

   COMO ADICIONAR UM ITEM NO MENU:
   Basta incluir um objeto no array ITENS_MENU abaixo:
     { rotulo, caminho, icone, perfis }
   - "perfis" limita quem ve o item. Deixe undefined para todos verem.
--------------------------------------------------------------------------- */
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  Briefcase,
  Users,
  CalendarDays,
  Award,
  User,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../contexts/useAuth";

const ITENS_MENU = [
  { rotulo: "Inicio", caminho: "/app", icone: House, fim: true },
  { rotulo: "Oportunidades", caminho: "/app/oportunidades", icone: Briefcase },
  { rotulo: "Apoio Academico", caminho: "/app/apoio", icone: Users },
  { rotulo: "Agendamentos", caminho: "/app/agendamentos", icone: CalendarDays },
  { rotulo: "Atividades", caminho: "/app/atividades", icone: Award },
  { rotulo: "Perfil", caminho: "/app/perfil", icone: User },
];

export default function MenuLateral({ aberto, aoFechar }) {
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();

  function aoSair() {
    sair();
    navegar("/login");
    aoFechar();
  }

  return (
    <>
      {/* Fundo escuro atras do menu no celular */}
      {aberto && (
        <button
          type="button"
          onClick={aoFechar}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col bg-noite-900 p-4 transition-transform duration-200",
          aberto ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:z-auto lg:translate-x-0",
        ].join(" ")}
      >
        <div className="mb-8 flex items-center justify-between px-1">
          <Logo tom="claro" />

          {/* So aparece no menu mobile */}
          <button
            type="button"
            onClick={aoFechar}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {ITENS_MENU.filter(
            (item) => !item.perfis || item.perfis.includes(usuario?.perfil)
          ).map(({ rotulo, caminho, icone: Icone, fim }) => (
            <NavLink
              key={caminho}
              to={caminho}
              end={fim}
              onClick={aoFechar}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-marca-600 font-medium text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <Icone size={17} />
              {rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <Avatar iniciais={usuario?.iniciais} tamanho="pequeno" />

            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-white">
                {usuario?.nome}
              </p>

              <p className="truncate text-[10px] capitalize text-white/50">
                {usuario?.perfil}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={aoSair}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-1 py-1 text-[11px] text-white/60 transition hover:text-white"
          >
            <LogOut size={13} />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
