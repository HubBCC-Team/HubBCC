import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";

export default function NovaSenha() {
  const navegar = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Lógica da barra de força
  const temTamanho = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumeroOuSimbolo = /[0-9\W]/.test(senha);

  const forca = [temTamanho, temMaiuscula, temNumeroOuSimbolo].filter(
    Boolean,
  ).length;

  let corBarra = "bg-slate-200";
  if (forca === 1) corBarra = "bg-erro"; // Vermelho
  if (forca === 2) corBarra = "bg-alerta"; // Amarelo
  if (forca === 3) corBarra = "bg-sucesso"; // Verde

  async function aoSubmeter(e) {
    e.preventDefault();
    setErro(null);

    if (forca < 3) {
      return setErro(
        "A senha precisa cumprir todos os requisitos de segurança.",
      );
    }
    if (senha !== confirmarSenha) {
      return setErro("As senhas não coincidem.");
    }

    setCarregando(true);
    try {
      // Simula o tempo de resposta do mock backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSucesso(true);
      // Aguarda 3 segundos e envia o utilizador de volta para o login
      setTimeout(() => navegar("/login"), 3000);
    } catch (err) {
      setErro("Ocorreu um erro ao redefinir a senha. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  // Ecrã de Sucesso
  if (sucesso) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-sucesso/10 p-4 text-sucesso">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Senha alterada!
        </h1>
        <p className="text-slate-600">
          A sua senha foi atualizada com sucesso. Será redirecionado para o
          login.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Criar nova senha</h1>
        <p className="mt-2 text-sm text-slate-600">
          Digite a sua nova senha abaixo. Ela precisa de ser forte para garantir
          a segurança da sua conta.
        </p>
      </div>

      {erro && (
        <Alerta variante="erro" className="mb-6">
          {erro}
        </Alerta>
      )}

      <form onSubmit={aoSubmeter} className="flex flex-col gap-5">
        {/* Campo da Nova Senha */}
        <div className="relative">
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Nova senha
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3 text-slate-400" />
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-marca-600 focus:ring-1 focus:ring-marca-600"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Requisitos e Barra de Força */}
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="mb-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-300 ${corBarra}`}
              style={{ width: `${(forca / 3) * 100}%` }}
            />
          </div>
          <ul className="space-y-1.5 text-[11px] sm:text-xs">
            <li
              className={`flex items-center gap-2 ${temTamanho ? "text-sucesso" : "text-slate-500"}`}
            >
              {temTamanho ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              Mínimo de 8 caracteres
            </li>
            <li
              className={`flex items-center gap-2 ${temMaiuscula ? "text-sucesso" : "text-slate-500"}`}
            >
              {temMaiuscula ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              Pelo menos uma letra maiúscula
            </li>
            <li
              className={`flex items-center gap-2 ${temNumeroOuSimbolo ? "text-sucesso" : "text-slate-500"}`}
            >
              {temNumeroOuSimbolo ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              Pelo menos um número ou símbolo
            </li>
          </ul>
        </div>

        {/* Campo Confirmar Senha */}
        <div className="relative">
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Confirmar senha
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3 text-slate-400" />
            <input
              type={mostrarSenha ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-marca-600 focus:ring-1 focus:ring-marca-600"
              required
            />
          </div>
        </div>

        <Botao type="submit" carregando={carregando} className="mt-2 w-full">
          Redefinir senha
        </Botao>
      </form>
    </div>
  );
}
