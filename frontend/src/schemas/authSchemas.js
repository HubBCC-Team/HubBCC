/* ---------------------------------------------------------------------------
   schemas/authSchemas.js
   SCHEMAS ZOD das telas de acesso: login, cadastro, recuperar e nova senha.
--------------------------------------------------------------------------- */
import { z } from "zod";

export const PERIODOS = [
  "1o periodo", "2o periodo", "3o periodo", "4o periodo",
  "5o periodo", "6o periodo", "7o periodo", "8o periodo",
];

const email = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .email("Informe um e-mail valido.")
  .transform((valor) => valor.toLowerCase());

/* --------------------------------- Login --------------------------------- */
export const loginSchema = z.object({
  email,
  senha: z.string().min(1, "Informe a senha."),
  lembrar: z.boolean().default(false),
});

/* -------------------------------- Cadastro ------------------------------- */
export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome.").min(2, "Nome muito curto."),
    sobrenome: z.string().trim().min(1, "Informe o sobrenome.").min(2, "Sobrenome muito curto."),
    email,
    matricula: z
      .string()
      .trim()
      .min(1, "Informe a matricula.")
      .regex(/^\d{6,12}$/, "A matricula deve ter de 6 a 12 numeros."),
    periodo: z.enum(PERIODOS, { error: "Selecione o periodo." }),
    // Opcional; se preenchido, precisa ter 10 ou 11 digitos (com DDD).
    telefone: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine((t) => t === "" || /^\d{10,11}$/.test(t.replace(/\D/g, "")), "Telefone invalido. Use DDD + numero."),
    senha: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
    confirmacao: z.string().min(1, "Confirme a senha."),
    aceite: z.boolean().refine((v) => v === true, "E preciso aceitar os termos de uso."),
  })
  .refine((d) => d.senha === d.confirmacao, {
    message: "As senhas nao conferem.",
    path: ["confirmacao"],
  });

/* ---------------------------- Recuperar senha ---------------------------- */
export const recuperarSenhaSchema = z.object({ email });

/* ------------------------------- Nova senha ------------------------------ */
// Regras exibidas na lista de requisitos da tela.
export const REGRAS_SENHA = [
  { id: "tamanho", texto: "Minimo de 8 caracteres", teste: (s) => s.length >= 8 },
  { id: "maiuscula", texto: "Pelo menos uma letra maiuscula", teste: (s) => /[A-Z]/.test(s) },
  { id: "numero", texto: "Pelo menos um numero ou simbolo", teste: (s) => /[0-9\W]/.test(s) },
];

export const novaSenhaSchema = z
  .object({
    senha: z
      .string()
      .min(8, "Minimo de 8 caracteres.")
      .regex(/[A-Z]/, "Inclua pelo menos uma letra maiuscula.")
      .regex(/[0-9\W]/, "Inclua pelo menos um numero ou simbolo."),
    confirmarSenha: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas nao coincidem.",
    path: ["confirmarSenha"],
  });
