/* ---------------------------------------------------------------------------
   components/rotas/RotaPrivada.jsx
   "Porteiro" das rotas internas.

   REGRAS:
   1) Enquanto o AuthContext verifica a sessao salva, mostramos "Carregando".
   2) Se ninguem estiver logado -> manda para /login (guardando de onde veio,
      para voltar ao destino original depois do login).
   3) Se a rota exigir um perfil especifico e o usuario nao tiver -> /sem-acesso.

   USO NO App.jsx:
     <Route element={<RotaPrivada />}> ...rotas de qualquer usuario logado... </Route>
     <Route element={<RotaPrivada perfis={["admin"]} />}> ...rotas restritas... </Route>
--------------------------------------------------------------------------- */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { Carregando } from "../ui/Estado";

export default function RotaPrivada({ perfis }) {
  const { autenticado, usuario, carregando } = useAuth();
  const localizacao = useLocation();

  if (carregando) return <Carregando texto="Verificando sessao..." />;

  if (!autenticado) {
    // "state" guarda a pagina que a pessoa tentou abrir; o Login usa isso.
    return <Navigate to="/login" state={{ de: localizacao.pathname }} replace />;
  }

  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to="/sem-acesso" replace />;
  }

  return <Outlet />;
}
