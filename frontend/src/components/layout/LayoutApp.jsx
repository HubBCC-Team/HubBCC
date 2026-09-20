/* ---------------------------------------------------------------------------
   components/layout/LayoutApp.jsx
   Esqueleto das telas INTERNAS: menu lateral + barra superior + conteudo.

   O <Outlet /> e onde o React Router encaixa a pagina da rota atual.
   Ver o mapa de rotas em src/App.jsx.
--------------------------------------------------------------------------- */
import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral";
import BarraSuperior from "./BarraSuperior";

export default function LayoutApp() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <MenuLateral />
      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior />
        {/* overflow-y-auto: so o conteudo rola, o menu fica fixo */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
