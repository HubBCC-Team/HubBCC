/* ---------------------------------------------------------------------------
   pages/recuperarSenha/RecuperarSenha.jsx
   TELA 4 - Recuperar senha (rota "/recuperar-senha").
   Dois estados: formulario -> confirmacao de envio.

   - React Hook Form + Zod (recuperarSenhaSchema): e-mail valido.
   - TanStack Query (useRecuperarSenha -> useMutation): quando der certo,
     recuperar.isSuccess troca a tela para a confirmacao.
--------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, MailCheck, ArrowLeft } from "lucide-react";
import { useRecuperarSenha } from "../../queries";
import { recuperarSenhaSchema } from "../../schemas/authSchemas";
import Campo from "../../components/ui/Campo";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";

export default function RecuperarSenha() {
  const recuperar = useRecuperarSenha();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  function aoEnviar({ email }) {
    recuperar.mutate(email);
  }

  // ----------------------- Estado 2: e-mail enviado -----------------------
  if (recuperar.isSuccess) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sucesso">
          <MailCheck size={20} />
        </span>
        <h1 className="text-xl font-semibold text-slate-900">Verifique seu e-mail</h1>
        <p className="mt-2 text-sm text-slate-500">
          Se o endereco <strong className="text-slate-700">{getValues("email")}</strong> estiver cadastrado,
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
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center text-center">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-marca-50 text-marca-700">
        <KeyRound size={20} />
      </span>
      <h1 className="text-xl font-semibold text-slate-900">Recuperar senha</h1>
      <p className="mt-2 text-sm text-slate-500">
        Informe seu e-mail institucional e enviaremos um link de redefinicao.
      </p>

      {recuperar.isError && (
        <Alerta variante="erro" className="mt-4 text-left">
          {recuperar.error.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoEnviar)} noValidate className="mt-6 space-y-4 text-left">
        <Campo
          type="email"
          autoComplete="email"
          placeholder="seu.nome@aluno.edu.br"
          erro={errors.email?.message}
          {...register("email")}
        />
        <Botao type="submit" larguraTotal tamanho="grande" carregando={recuperar.isPending}>
          Enviar link de recuperacao
        </Botao>
      </form>

      <Link
        to="/login"
        className="mx-auto mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-marca-700"
      >
        <ArrowLeft size={13} /> Voltar ao login
      </Link>
    </div>
  );
}
