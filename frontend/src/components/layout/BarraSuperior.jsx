/* ---------------------------------------------------------------------------
   components/layout/BarraSuperior.jsx
   Faixa branca do topo: campo de busca global, notificacoes e avatar.

   OBSERVACAO: a busca do topo leva para a tela de Oportunidades ja filtrada.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../contexts/useAuth";

export default function BarraSuperior() {
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const [termo, setTermo] = useState("");

  // Enter no campo de busca -> vai para /app/oportunidades?busca=...
  function aoBuscar(evento) {
    evento.preventDefault();
    navegar(`/app/oportunidades?busca=${encodeURIComponent(termo)}`);
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <form onSubmit={aoBuscar} className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar no HubBCC..."
          className="campo pl-9"
        />
      </form>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Notificacoes"
        >
          <Bell size={17} />
          {/* Bolinha vermelha de "tem novidade" */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-erro" />
        </button>
        <Avatar iniciais={usuario?.iniciais} tamanho="pequeno" />
      </div>
    </header>
  );
}
