import { z } from "zod";

const vazioParaUndefined = (v) => (v === "" || v === null ? undefined : v);

export const disciplinaCriacaoSchema = z.object({
  codigo: z.preprocess(
    vazioParaUndefined,
    z
      .string()
      .trim()
      .min(2, "Codigo muito curto.")
      .max(20, "Maximo de 20 caracteres.")
      .optional(),
  ),
  nome: z
    .string({ error: "Informe o nome da disciplina." })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "Maximo de 120 caracteres."),
  ativa: z.boolean().optional().default(true),
});

export const disciplinaAtualizacaoSchema = disciplinaCriacaoSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Envie ao menos um campo para alterar.",
  });

export const disciplinaFiltrosSchema = z.object({
  busca: z.preprocess(
    vazioParaUndefined,
    z.string().trim().max(100).optional(),
  ),
  ativa: z.preprocess(vazioParaUndefined, z.enum(["true", "false"]).optional()),
});
