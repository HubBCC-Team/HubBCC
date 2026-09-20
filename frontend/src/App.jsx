/* ---------------------------------------------------------------------------
   App.jsx
   MAPA DE ROTAS do HubBCC.

   Este e o arquivo mais importante para entender a navegacao. Cada <Route>
   liga um endereco (path) a uma tela (element).

   ESTRUTURA:
   - Rotas publicas .................. "/", "/login", "/cadastro", "/recuperar-senha"
   - Rotas privadas (exigem login) ... tudo que comeca com "/app"
   - Rotas de erro ................... "/sem-acesso" e "*" (404)

   COMO ADICIONAR UMA TELA NOVA:
   1) crie o arquivo em src/pages/...
   2) importe aqui em cima
   3) adicione <Route path="..." element={<SuaTela />} /> no grupo certo
   4) se ela deve aparecer no menu, inclua tambem em components/layout/MenuLateral.jsx
--------------------------------------------------------------------------- */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RotaPrivada from "./components/rotas/RotaPrivada";

// Layouts (o "esqueleto" que envolve varias telas)
import LayoutAcesso from "./components/layout/LayoutAcesso";
import LayoutApp from "./components/layout/LayoutApp";

// Telas publicas
import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha";

// Telas internas
import Home from "./pages/home/Home";
import ListaOportunidades from "./pages/oportunidades/ListaOportunidades";
import DetalheOportunidade from "./pages/oportunidades/DetalheOportunidade";
import CadastrarOportunidade from "./pages/oportunidades/CadastrarOportunidade";
import RealizarCandidatura from "./pages/oportunidades/RealizarCandidatura";
import MinhasCandidaturas from "./pages/oportunidades/MinhasCandidaturas";
import ListaApoio from "./pages/apoio/ListaApoio";
import DetalheMonitoria from "./pages/apoio/DetalheMonitoria";
import CriarOferta from "./pages/apoio/CriarOferta";
import RealizarAgendamento from "./pages/agendamentos/RealizarAgendamento";
import MeusAgendamentos from "./pages/agendamentos/MeusAgendamentos";
import RegistrarAtendimento from "./pages/agendamentos/RegistrarAtendimento";
import AtividadesHoras from "./pages/atividades/AtividadesHoras";
import RegistrarAtividade from "./pages/atividades/RegistrarAtividade";
import Perfil from "./pages/perfil/Perfil";

// Telas de erro
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    // BrowserRouter = habilita a navegacao por URL
    <BrowserRouter>
      {/* AuthProvider = deixa o usuario logado disponivel em todas as telas */}
      <AuthProvider>
        <Routes>
          {/* ===================== ROTAS PUBLICAS ===================== */}
          <Route path="/" element={<Landing />} />

          {/* Estas tres compartilham o painel azul do LayoutAcesso */}
          <Route element={<LayoutAcesso />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          </Route>

          {/* ===================== ROTAS PRIVADAS ===================== */}
          {/* RotaPrivada barra quem nao esta logado.                     */}
          {/* LayoutApp desenha menu lateral + barra superior.            */}
          <Route element={<RotaPrivada />}>
            <Route path="/app" element={<LayoutApp />}>
              {/* index = a tela mostrada em "/app" */}
              <Route index element={<Home />} />

              {/* --- Oportunidades academicas (casos de uso 1 a 8) --- */}
              <Route path="oportunidades" element={<ListaOportunidades />} />
              <Route path="oportunidades/nova" element={<CadastrarOportunidade />} />
              <Route path="oportunidades/:id" element={<DetalheOportunidade />} />
              <Route path="oportunidades/:id/candidatura" element={<RealizarCandidatura />} />
              <Route path="candidaturas" element={<MinhasCandidaturas />} />

              {/* --- Apoio academico (casos de uso 9 a 13) --- */}
              <Route path="apoio" element={<ListaApoio />} />
              <Route path="apoio/nova" element={<CriarOferta />} />
              <Route path="apoio/:id" element={<DetalheMonitoria />} />
              <Route path="apoio/:id/agendar" element={<RealizarAgendamento />} />

              {/* --- Agendamentos (casos de uso 14 a 18) --- */}
              <Route path="agendamentos" element={<MeusAgendamentos />} />
              <Route path="agendamentos/:id/registrar" element={<RegistrarAtendimento />} />

              {/* --- Atividades complementares (casos de uso 19 e 20) --- */}
              <Route path="atividades" element={<AtividadesHoras />} />
              <Route path="atividades/nova" element={<RegistrarAtividade />} />

              <Route path="perfil" element={<Perfil />} />
            </Route>
          </Route>

          {/* ====================== ROTAS DE ERRO ====================== */}
          <Route path="/sem-acesso" element={<Unauthorized />} />

          {/* Atalhos antigos continuam funcionando */}
          <Route path="/home" element={<Navigate to="/app" replace />} />

          {/* "*" pega qualquer coisa que nao casou acima */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
