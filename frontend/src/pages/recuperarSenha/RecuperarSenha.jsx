/* ---------------------------------------------------------------------------
   pages/recuperarSenha/RecuperarSenha.jsx
   TELA 4 — Recuperar senha (rota "/recuperar-senha").

   Tem dois estados visuais:
   - formulario (padrao);
   - confirmacao de envio (depois que o e-mail e enviado).
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, MailCheck, ArrowLeft } from "lucide-react";
import { recuperarSenha } from "../../service/authService";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await recuperarSenha(email);
      setEnviado(true); // troca a tela para a confirmacao
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  // ----------------------- Estado 2: e-mail enviado -----------------------
  if (enviado) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sucesso">
          <MailCheck size={20} />
        </span>
        <h1 className="text-xl font-semibold text-slate-900">Verifique seu e-mail</h1>
        <p className="mt-2 text-sm text-slate-500">
          Se o endereco <strong className="text-slate-700">{email}</strong> estiver cadastrado,
          enviaremos as instrucoes para redefinir sua senha.
        </p>
        <Botao as={Link} to="/login" variante="contorno" larguraTotal className="mt-6">
          Voltar ao login
        </Botao>
      </div>
    );
  }

  // ------------------------ Estado 1: formulario ------------------------
  return (
    <div className="text-center">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-marca-50 text-marca-700">
        <KeyRound size={20} />
      </span>
      <h1 className="text-xl font-semibold text-slate-900">Recuperar senha</h1>
      <p className="mt-2 text-sm text-slate-500">
        Informe seu e-mail institucional e enviaremos um link de redefinicao.
      </p>

      {erro && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="mt-6 space-y-4 text-left">
        <Campo
          name="email"
          type="email"
          required
          placeholder="seu.nome@aluno.edu.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Botao type="submit" larguraTotal tamanho="grande" carregando={enviando}>
          Enviar link de recuperacao
        </Botao>
      </form>

      <Link
        to="/login"
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-marca-700"
      >
        <ArrowLeft size={13} /> Voltar ao login
      </Link>
    </div>
  );
}
