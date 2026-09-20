/* ---------------------------------------------------------------------------
   components/layout/Logo.jsx
   Marca do HubBCC (icone + nome). Usada na sidebar e nas telas de acesso.

   PROPS:
   - tom : "claro" (texto branco, para fundo azul) | "escuro"
--------------------------------------------------------------------------- */
import { GraduationCap } from "lucide-react";

export default function Logo({ tom = "claro", compacto = false }) {
  const corTitulo = tom === "claro" ? "text-white" : "text-slate-900";
  const corSubtitulo = tom === "claro" ? "text-white/60" : "text-slate-500";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-marca-600 text-white">
        <GraduationCap size={20} />
      </div>
      {!compacto && (
        <div className="leading-tight">
          <p className={`text-sm font-semibold ${corTitulo}`}>HubBCC</p>
          <p className={`text-[10px] ${corSubtitulo}`}>Apoio e desenvolvimento academico</p>
        </div>
      )}
    </div>
  );
}
