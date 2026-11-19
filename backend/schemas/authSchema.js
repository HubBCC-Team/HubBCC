/* ---------------------------------------------------------------------------
   schemas/authSchema.js
   Validacao ZOD de AUTENTICACAO.                          Responsavel: Marina

   - cadastroSchema -> POST /auth/cadastro
   - loginSchema    -> POST /auth/login

   Campos como id, perfil, curso e senhaHash sao controlados pelo backend.
   O cadastro publico nunca escolhe o proprio perfil.
--------------------------------------------------------------------------- */

import { z } from "zod";

export const PERIODOS = [
  "1o periodo",
  "2o periodo",
  "3o periodo",
  "4o periodo",
  "5o periodo",
  "6o periodo",
  "7o periodo",
  "8o periodo",
];

const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .email("Informe um e-mail valido.")
  .transform((email) => email.toLowerCase());

const telefoneSchema = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine(
    (telefone) =>
      telefone === "" ||
      /^\d{10,11}$/.test(
        telefone.replace(/\D/g, ""),
      ),
    "Telefone invalido. Use DDD + numero.",
  )
  .transform((telefone) =>
    telefone.replace(/\D/g, ""),
  );

/* -------------------------------- Cadastro ------------------------------- */

export const cadastroSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome.")
    .min(
      3,
      "O nome deve ter pelo menos 3 caracteres.",
    )
    .max(
      120,
      "O nome deve ter no maximo 120 caracteres.",
    ),

  email: emailSchema,

  senha: z
    .string()
    .min(
      6,
      "A senha precisa ter ao menos 6 caracteres.",
    )
    .max(
      100,
      "A senha deve ter no maximo 100 caracteres.",
    ),

  matricula: z
    .string()
    .trim()
    .min(1, "Informe a matricula.")
    .regex(
      /^\d{6,12}$/,
      "A matricula deve ter de 6 a 12 numeros.",
    ),

  periodo: z.enum(PERIODOS, {
    error: "Selecione o periodo.",
  }),

  telefone: telefoneSchema,
});

/* --------------------------------- Login --------------------------------- */

export const loginSchema = z.object({
  email: emailSchema,

  senha: z
    .string()
    .min(1, "Informe a senha."),
});