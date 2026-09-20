/* ---------------------------------------------------------------------------
   pages/NotFound.jsx
   Rota "*" — qualquer endereco que nao exista cai aqui.
--------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import Botao from "../components/ui/Botao";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 p-6 text-center">
      <p className="text-5xl font-semibold text-marca-600">404</p>
      <h1 className="text-lg font-semibold text-slate-900">Pagina nao encontrada</h1>
      <p className="max-w-sm text-sm text-slate-500">
        O endereco que voce tentou acessar nao existe ou foi movido.
      </p>
      <Botao as={Link} to="/app" className="mt-2">
        Voltar para o inicio
      </Botao>
    </div>
  );
}
