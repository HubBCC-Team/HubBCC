/* ---------------------------------------------------------------------------
   pages/cadastro/Cadastro.jsx
   TELA 3 — Criar conta (rota "/cadastro").

   Faz validacao simples no proprio front antes de enviar:
   - senha com no minimo 6 caracteres;
   - confirmacao igual a senha;
   - aceite dos termos.
--------------------------------------------------------------------------- */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useFormulario } from "../../hooks/useFormulario";
import Campo, { CampoSelecao } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";

const PERIODOS = ["1o periodo", "2o periodo", "3o periodo", "4o periodo", "5o periodo", "6o periodo", "7o periodo", "8o periodo"];

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navegar = useNavigate();

  const { valores, aoMudar } = useFormulario({
    nome: "",
    sobrenome: "",
    email: "",
    matricula: "",
    periodo: "",
    telefone: "",
    senha: "",
    confirmacao: "",
    aceite: false,
  });

  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);

    // ------------------------ Validacoes locais ------------------------
    if (valores.senha.length < 6) {
      return setErro("A senha precisa ter ao menos 6 caracteres.");
    }
    if (valores.senha !== valores.confirmacao) {
      return setErro("As senhas nao conferem.");
    }
    if (!valores.aceite) {
      return setErro("E preciso aceitar os termos de uso.");
    }

    setEnviando(true);
    try {
      await cadastrar({
        nome: `${valores.nome} ${valores.sobrenome}`.trim(),
        email: valores.email,
        senha: valores.senha,
        matricula: valores.matricula,
        periodo: valores.periodo,
        telefone: valores.telefone,
      });
      navegar("/app", { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Criar conta</h1>
      <p className="mt-1 text-sm text-slate-500">Use seu e-mail institucional.</p>

      {erro && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-erro">
          {erro}
        </div>
      )}

      <form onSubmit={aoEnviar} className="mt-6 space-y-4">
        {/* grid-cols-2: dois campos lado a lado */}
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Nome" name="nome" required value={valores.nome} onChange={aoMudar} />
          <Campo rotulo="Sobrenome" name="sobrenome" required value={valores.sobrenome} onChange={aoMudar} />
        </div>

        <Campo
          rotulo="E-mail institucional"
          name="email"
          type="email"
          required
          placeholder="seu.nome@aluno.edu.br"
          value={valores.email}
          onChange={aoMudar}
        />

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Matricula" name="matricula" required value={valores.matricula} onChange={aoMudar} />
          <CampoSelecao
            rotulo="Periodo"
            name="periodo"
            required
            placeholder="Selecione"
            opcoes={PERIODOS}
            value={valores.periodo}
            onChange={aoMudar}
          />
        </div>

        <Campo rotulo="Telefone" name="telefone" placeholder="(21) 90000-0000" value={valores.telefone} onChange={aoMudar} />

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Senha" name="senha" type="password" required value={valores.senha} onChange={aoMudar} />
          <Campo rotulo="Confirmar senha" name="confirmacao" type="password" required value={valores.confirmacao} onChange={aoMudar} />
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            name="aceite"
            checked={valores.aceite}
            onChange={aoMudar}
            className="mt-0.5 rounded border-slate-300"
          />
          Li e aceito os termos de uso e a politica de privacidade.
        </label>

        <Botao type="submit" larguraTotal tamanho="grande" carregando={enviando}>
          Criar minha conta
        </Botao>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Ja tem conta?{" "}
        <Link to="/login" className="font-medium text-marca-700 hover:underline">
          Fazer login
        </Link>
      </p>
    </>
  );
}
