/* ---------------------------------------------------------------------------
   pages/recuperarSenha/NovaSenha.jsx
   Segunda etapa da recuperacao: criar nova senha.

   - React Hook Form + Zod (novaSenhaSchema): 8+ caracteres, maiuscula,
     numero/simbolo e confirmacao igual. A barra de forca e a lista de
     requisitos leem o valor digitado com watch().
   - TanStack Query (useRedefinirSenha -> useMutation) chama
     POST /auth/nova-senha no JSON Server (antes era um setTimeout simulado).
--------------------------------------------------------------------------- */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { useRedefinirSenha } from "../../queries";
import { novaSenhaSchema, REGRAS_SENHA } from "../../schemas/authSchemas";
import Botao from "../../components/ui/Botao";
import Alerta from "../../components/ui/Alerta";

const CORES_FORCA = ["bg-slate-200", "bg-erro", "bg-alerta", "bg-sucesso"];

export default function NovaSenha() {
  const navegar = useNavigate();
  const redefinir = useRedefinirSenha();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(novaSenhaSchema),
    defaultValues: { senha: "", confirmarSenha: "" },
    mode: "onTouched",
  });

  const senha = watch("senha");
  const forca = REGRAS_SENHA.filter((regra) => regra.teste(senha)).length;

  // Depois do sucesso, volta para o login em 3 segundos.
  useEffect(() => {
    if (!redefinir.isSuccess) return;
    const timer = setTimeout(() => navegar("/login"), 3000);
    return () => clearTimeout(timer);
  }, [redefinir.isSuccess, navegar]);

  function aoSubmeter({ senha: novaSenha }) {
    redefinir.mutate(novaSenha);
  }

  if (redefinir.isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-sucesso/10 p-4 text-sucesso">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Senha alterada!</h1>
        <p className="text-slate-600">Sua senha foi atualizada com sucesso. Voce sera redirecionado para o login.</p>
      </div>
    );
  }

  const classeInput = (erro) =>
    [
      "w-full rounded-lg border py-2.5 pl-10 text-sm outline-none transition focus:border-marca-600 focus:ring-1 focus:ring-marca-600",
      erro ? "border-red-400" : "border-slate-300",
    ].join(" ");

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Criar nova senha</h1>
        <p className="mt-2 text-sm text-slate-600">
          Digite sua nova senha abaixo. Ela precisa ser forte para garantir a seguranca da sua conta.
        </p>
      </div>

      {redefinir.isError && (
        <Alerta variante="erro" className="mb-6">
          {redefinir.error.message}
        </Alerta>
      )}

      <form onSubmit={handleSubmit(aoSubmeter)} noValidate className="flex flex-col gap-5">
        {/* Nova senha */}
        <div>
          <label htmlFor="senha" className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Nova senha
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3 text-slate-400" />
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`${classeInput(errors.senha)} pr-10`}
              {...register("senha")}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.senha && <p className="mt-1 text-[11px] text-erro">{errors.senha.message}</p>}
        </div>

        {/* Barra de forca + requisitos */}
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="mb-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-300 ${CORES_FORCA[forca]}`}
              style={{ width: `${(forca / REGRAS_SENHA.length) * 100}%` }}
            />
          </div>
          <ul className="space-y-1.5 text-[11px] sm:text-xs">
            {REGRAS_SENHA.map((regra) => {
              const ok = regra.teste(senha);
              return (
                <li key={regra.id} className={`flex items-center gap-2 ${ok ? "text-sucesso" : "text-slate-500"}`}>
                  {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {regra.texto}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Confirmar senha */}
        <div>
          <label htmlFor="confirmarSenha" className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Confirmar senha
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3 text-slate-400" />
            <input
              id="confirmarSenha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`${classeInput(errors.confirmarSenha)} pr-3`}
              {...register("confirmarSenha")}
            />
          </div>
          {errors.confirmarSenha && <p className="mt-1 text-[11px] text-erro">{errors.confirmarSenha.message}</p>}
        </div>

        <Botao type="submit" carregando={redefinir.isPending} className="mt-2 w-full">
          Redefinir senha
        </Botao>
      </form>
    </div>
  );
}
