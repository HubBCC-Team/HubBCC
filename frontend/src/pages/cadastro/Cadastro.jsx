/* ---------------------------------------------------------------------------
   pages/cadastro/Cadastro.jsx
   TELA 3 - Criar conta (rota "/cadastro").

   - React Hook Form + Zod (cadastroSchema): nome, sobrenome, e-mail,
     matricula numerica, periodo, telefone opcional, senha >= 6,
     confirmacao igual e aceite dos termos. Cada erro aparece no seu campo.
   - TanStack Query (useCadastrar -> useMutation). E-mail duplicado (erro
     do servidor) aparece no <Alerta>.
--------------------------------------------------------------------------- */
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCadastrar } from "../../queries";
import { cadastroSchema, PERIODOS } from "../../schemas/authSchemas";
import Campo, { CampoSelecao } from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";

export default function Cadastro() {
  const navegar = useNavigate();
  const cadastrar = useCadastrar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      matricula: "",
      periodo: "",
      telefone: "",
      senha: "",
      confirmacao: "",
      aceite: false,
    },
    mode: "onTouched",
  });

  async function aoEnviar(v) {
    try {
      await cadastrar.mutateAsync({
        nome: `${v.nome} ${v.sobrenome}`.trim(),
        email: v.email,
        senha: v.senha,
        matricula: v.matricula,
        periodo: v.periodo,
        telefone: v.telefone,
      });
      navegar("/app", { replace: true });
    } catch {
      // Mensagem exibida no <Alerta> (cadastrar.error).
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Criar conta</h1>
      <p className="mt-1 text-sm text-slate-500">Use seu e-mail institucional.</p>

      {cadastrar.isError && (
        <Alerta variante="erro" className="mt-4">
          {cadastrar.error.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Nome" autoComplete="given-name" erro={errors.nome?.message} {...register("nome")} />
          <Campo
            rotulo="Sobrenome"
            autoComplete="family-name"
            erro={errors.sobrenome?.message}
            {...register("sobrenome")}
          />
        </div>

        <Campo
          rotulo="E-mail institucional"
          type="email"
          autoComplete="email"
          placeholder="seu.nome@aluno.edu.br"
          erro={errors.email?.message}
          {...register("email")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Matricula" inputMode="numeric" erro={errors.matricula?.message} {...register("matricula")} />
          <CampoSelecao
            rotulo="Periodo"
            placeholder="Selecione"
            opcoes={PERIODOS}
            erro={errors.periodo?.message}
            {...register("periodo")}
          />
        </div>

        <Campo
          rotulo="Telefone (opcional)"
          type="tel"
          placeholder="(21) 90000-0000"
          erro={errors.telefone?.message}
          {...register("telefone")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Campo
            rotulo="Senha"
            type="password"
            autoComplete="new-password"
            erro={errors.senha?.message}
            {...register("senha")}
          />
          <Campo
            rotulo="Confirmar senha"
            type="password"
            autoComplete="new-password"
            erro={errors.confirmacao?.message}
            {...register("confirmacao")}
          />
        </div>

        <div>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" className="mt-0.5 rounded border-slate-300" {...register("aceite")} />
            Li e aceito os termos de uso e a politica de privacidade.
          </label>
          {errors.aceite && <p className="mt-1 text-[11px] text-erro">{errors.aceite.message}</p>}
        </div>

        <Botao type="submit" larguraTotal tamanho="grande" carregando={isSubmitting}>
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
