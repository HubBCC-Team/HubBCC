import { z } from "zod";
import { idPositivo } from "./agendamentoSchema.js";

export const CATEGORIAS_ATIVIDADE = [
  "Ensino",
  "Pesquisa",
  "Extensao",
  "Evento",
];
export const SITUACOES_ATIVIDADE = ["Em analise", "Aprovada", "Reprovada"];

function hojeISO() {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Sao_Paulo",
  });
}

const vazioParaUndefined = (v) => (v === "" || v === null ? undefined : v);

const dataConclusao = z
  .string({ error: "Informe a data de conclusao." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida. Use AAAA-MM-DD.")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Data invalida.")
  .refine((v) => v <= hojeISO(), "A data de conclusao nao pode ser futura.");

const atividadeBase = z.object({
  categoria: z.enum(CATEGORIAS_ATIVIDADE, { error: "Selecione a categoria." }),
  titulo: z
    .string({ error: "Informe o nome da atividade." })
    .trim()
    .min(3, "Nome muito curto.")
    .max(120, "Maximo de 120 caracteres."),
  data: dataConclusao,
  horas: z.coerce
    .number({ error: "Informe a carga horaria." })
    .int("Informe horas inteiras.")
    .min(1, "Minimo de 1 hora.")
    .max(200, "Maximo de 200 horas por atividade."),
  descricao: z
    .string()
    .trim()
    .max(500, "Maximo de 500 caracteres.")
    .optional()
    .default(""),
  disciplinaId: z.preprocess(vazioParaUndefined, idPositivo.optional()),
  comprovante: z.string().trim().max(255).optional().default(""),
});

export const atividadeCriacaoSchema = atividadeBase;

export const atividadeAtualizacaoSchema = atividadeBase
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Envie ao menos um campo para alterar.",
  });

export const atividadeAvaliacaoSchema = z.object({
  situacao: z.enum(["Aprovada", "Reprovada"], {
    error: "A situacao deve ser Aprovada ou Reprovada.",
  }),
  observacao: z.string().trim().max(500).optional().default(""),
});

export const atividadeFiltrosSchema = z.object({
  usuarioId: z.preprocess(vazioParaUndefined, idPositivo.optional()),
  categoria: z.preprocess(
    vazioParaUndefined,
    z.enum(CATEGORIAS_ATIVIDADE).optional(),
  ),
  situacao: z.preprocess(
    vazioParaUndefined,
    z.enum(SITUACOES_ATIVIDADE).optional(),
  ),
  busca: z.preprocess(
    vazioParaUndefined,
    z.string().trim().max(100).optional(),
  ),
});
