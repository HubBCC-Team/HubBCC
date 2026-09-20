/* ---------------------------------------------------------------------------
   pages/login/Login.jsx
   TELA 2 — Login (rota "/login").

   FLUXO:
   1) O usuario preenche e-mail e senha.
   2) Chamamos entrar() do AuthContext, que chama o authService.
   3) Dando certo, navegamos para /app (ou para a pagina que ele tentou abrir).
   4) Dando errado, mostramos a mensagem de erro acima do formulario.

   CONTAS DE TESTE (definidas em src/mocks/db.js):
     aluno@hubbcc.br   / 123456
     monitor@hubbcc.br / 123456
     admin@hubbcc.br   / 123456
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useFormulario } from "../../hooks/useFormulario";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";

export default function Login() {
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const localizacao = useLocation();

  // Campos do formulario.
  const { valores, aoMudar } = useFormulario({ email: "", senha: "", lembrar: false });

  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault(); // impede o recarregamento da pagina
    setErro(null);
    setEnviando(true);

    try {
      await entrar(valores.email, valores.senha);
      // Se a RotaPrivada mandou o usuario para ca, voltamos ao destino original.
      const destino = localizacao.state?.de ?? "/app";
      navegar(destino, { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Bem-vindo de volta</h1>
      <p className="mt-1 text-sm text-slate-500">Acesse sua conta para continuar.</p>

      {/* Mensagem de erro do login */}
      {erro && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="mt-6 space-y-4">
        <Campo
          rotulo="E-mail institucional"
          name="email"
          type="email"
          required
          placeholder="seu.nome@aluno.edu.br"
          value={valores.email}
          onChange={aoMudar}
        />
        <Campo
          rotulo="Senha"
          name="senha"
          type="password"
          required
          placeholder="Digite sua senha"
          value={valores.senha}
          onChange={aoMudar}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              name="lembrar"
              checked={valores.lembrar}
              onChange={aoMudar}
              className="rounded border-slate-300"
            />
            Lembrar de mim
          </label>
          <Link to="/recuperar-senha" className="text-marca-700 hover:underline">
            Esqueci a senha
          </Link>
        </div>

        <Botao type="submit" larguraTotal tamanho="grande" carregando={enviando}>
          Entrar
        </Botao>
      </form>

      {/* Botao ilustrativo: nao ha integracao SSO no mock */}
      <Botao variante="contorno" larguraTotal tamanho="grande" className="mt-3" disabled>
        Entrar com Microsoft 365
      </Botao>

      <p className="mt-6 text-center text-xs text-slate-500">
        Ainda nao tem conta?{" "}
        <Link to="/cadastro" className="font-medium text-marca-700 hover:underline">
          Cadastre-se
        </Link>
      </p>

      {/* Lembrete das credenciais de teste — remova quando houver backend real */}
      <div className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
        <strong className="text-slate-600">Contas de teste:</strong>
        <br />
        aluno@hubbcc.br · monitor@hubbcc.br · admin@hubbcc.br
        <br />
        senha: 123456
      </div>
    </>
  );
}
