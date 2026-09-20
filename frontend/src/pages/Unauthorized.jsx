/* ---------------------------------------------------------------------------
   pages/Unauthorized.jsx
   Rota "/sem-acesso" — exibida quando o perfil do usuario nao permite a rota.
   Quem redireciona para ca e o components/rotas/RotaPrivada.jsx.
--------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Botao from "../components/ui/Botao";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 p-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-alerta">
        <ShieldAlert size={24} />
      </span>
      <h1 className="text-lg font-semibold text-slate-900">Acesso nao autorizado</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Seu perfil nao tem permissao para acessar esta area do HubBCC.
      </p>
      <Botao as={Link} to="/app" className="mt-2">
        Voltar para o inicio
      </Botao>
    </div>
  );
}
