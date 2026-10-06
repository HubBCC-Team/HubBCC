/* ---------------------------------------------------------------------------
   pages/login/Login.jsx
   TELA 2 - Login (rota "/login").

   - React Hook Form + Zod (loginSchema): e-mail valido e senha preenchida,
     mensagens embaixo de cada campo.
   - TanStack Query (useEntrar -> useMutation) chama o AuthContext.entrar().
   - Erro do servidor (senha errada) aparece no <Alerta>.

   CONTAS DE TESTE (db.json): aluno@ / monitor@ / admin@hubbcc.br - senha 123456
--------------------------------------------------------------------------- */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEntrar } from "../../queries";
import { loginSchema } from "../../schemas/authSchemas";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";

export default function Login() {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const entrar = useEntrar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "", lembrar: false },
    mode: "onTouched",
  });

  async function aoEnviar({ email, senha }) {
    try {
      await entrar.mutateAsync({ email, senha });
      // Se a RotaPrivada mandou o usuario para ca, voltamos ao destino original.
      navegar(localizacao.state?.de ?? "/app", { replace: true });
    } catch {
      // A mensagem fica em entrar.error e aparece no <Alerta> abaixo.
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Bem-vindo de volta</h1>
      <p className="mt-1 text-sm text-slate-500">Acesse sua conta para continuar.</p>

      {entrar.isError && (
        <Alerta variante="erro" className="mt-4">
          {entrar.error.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="mt-6 space-y-4">
        <Campo
          rotulo="E-mail institucional"
          type="email"
          autoComplete="email"
          placeholder="seu.nome@aluno.edu.br"
          erro={errors.email?.message}
          {...register("email")}
        />
        <Campo
          rotulo="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          erro={errors.senha?.message}
          {...register("senha")}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="rounded border-slate-300" {...register("lembrar")} />
            Lembrar de mim
          </label>
          <Link to="/recuperar-senha" className="text-marca-700 hover:underline">
            Esqueci a senha
          </Link>
        </div>

        <Botao type="submit" larguraTotal tamanho="grande" carregando={isSubmitting}>
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
