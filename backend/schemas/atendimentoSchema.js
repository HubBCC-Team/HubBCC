/* ---------------------------------------------------------------------------
   schemas/atendimentoSchema.js
   Validacao ZOD de ATENDIMENTOS.                         Responsavel: Geovanne

   Espelha as regras do frontend (src/schemas/agendamentoSchemas.js), porque o
   backend nao pode confiar apenas na validacao da tela.

   - atendimentoCriacaoSchema    -> POST /atendimentos
   - atendimentoAtualizacaoSchema-> PUT  /atendimentos/:id
   - atendimentoFiltrosSchema    -> query string do GET /atendimentos
--------------------------------------------------------------------------- */
import { z } from "zod";
import { idPositivo } from "./agendamentoSchema.js";

export const TAGS_AVALIACAO = [
  "Didatico",
  "Pontual",
  "Paciente",
  "Claro",
  "Atencioso",
];

// O frontend tambem manda "registradoEm"; o servidor ignora e define o proprio.
export const registroSchema = z
  .object({
    compareceu: z.boolean({ error: "Informe se o aluno compareceu." }),
    duracao: z.coerce
      .number({ error: "Informe a duracao em minutos." })
      .int("Use minutos inteiros.")
      .min(0, "A duracao nao pode ser negativa.")
      .max(480, "Maximo de 480 minutos (8 horas)."),
    observacoes: z
      .string()
      .trim()
      .max(1000, "Maximo de 1000 caracteres.")
      .optional()
      .default(""),
  })
  .refine((dados) => !dados.compareceu || dados.duracao >= 15, {
    message: "Se o aluno compareceu, informe pelo menos 15 minutos.",
    path: ["duracao"],
  })
  .transform((dados) => ({
    ...dados,
    duracao: dados.compareceu ? dados.duracao : 0,
  }));

export const avaliacaoSchema = z.object({
  nota: z
    .number({ error: "Informe a nota." })
    .int("A nota deve ser inteira.")
    .min(1, "A avaliacao deve ser de 1 a 5.")
    .max(5, "A avaliacao deve ser de 1 a 5."),
  tags: z.array(z.enum(TAGS_AVALIACAO)).optional().default([]),
  comentario: z
    .string()
    .trim()
    .max(500, "Maximo de 500 caracteres.")
    .optional()
    .default(""),
});

// POST /atendimentos
export const atendimentoCriacaoSchema = z.object({
  agendamentoId: idPositivo,
  registro: registroSchema,
});

// PUT /atendimentos/:id  (registro e/ou avaliacao)
export const atendimentoAtualizacaoSchema = z
  .object({
    registro: registroSchema.optional(),
    avaliacao: avaliacaoSchema.optional(),
  })
  .refine(
    (dados) => dados.registro !== undefined || dados.avaliacao !== undefined,
    { message: "Informe registro e/ou avaliacao." },
  );

// GET /atendimentos
const vazioParaUndefined = (valor) =>
  valor === "" || valor === null ? undefined : valor;

export const atendimentoFiltrosSchema = z.object({
  agendamentoId: z.preprocess(vazioParaUndefined, idPositivo.optional()),
  usuarioId: z.preprocess(vazioParaUndefined, idPositivo.optional()),
});
