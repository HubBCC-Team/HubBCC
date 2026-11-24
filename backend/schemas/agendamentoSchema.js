/* ---------------------------------------------------------------------------
   schemas/agendamentoSchema.js
   Validacao ZOD de AGENDAMENTOS.                         Responsavel: Geovanne

   - agendamentoCriacaoSchema     -> POST /agendamentos
   - agendamentoReagendarSchema   -> PUT  /agendamentos/:id
   - agendamentoFiltrosSchema     -> query string do GET /agendamentos
--------------------------------------------------------------------------- */
import { z } from "zod";

export const SITUACOES_AGENDAMENTO = ["Confirmado", "Realizado", "Cancelado"];

// Hoje (AAAA-MM-DD) no fuso de Brasilia, independente do fuso do servidor.
export function hojeISO() {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Sao_Paulo",
  });
}

export const idPositivo = z.coerce
  .number({ error: "Informe um identificador valido." })
  .int("O identificador deve ser inteiro.")
  .positive("O identificador deve ser positivo.");

const vazioParaUndefined = (valor) =>
  valor === "" || valor === null ? undefined : valor;

const filtroId = z.preprocess(vazioParaUndefined, idPositivo.optional());

const data = z
  .string({ error: "Informe a data." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida. Use AAAA-MM-DD.")
  .refine((valor) => {
    const d = new Date(`${valor}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
  }, "Data invalida.")
  .refine((valor) => valor >= hojeISO(), "A data nao pode estar no passado.");

const hora = z
  .string({ error: "Informe o horario." })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horario invalido. Use HH:MM.");

// POST /agendamentos
// usuarioId e opcional: quem agenda e sempre o usuario do token (so o admin
// pode agendar em nome de outro).
export const agendamentoCriacaoSchema = z.object({
  usuarioId: idPositivo.optional(),
  ofertaId: idPositivo,
  data,
  hora,
});

// PUT /agendamentos/:id  (reagendar)
export const agendamentoReagendarSchema = z.object({ data, hora });

// GET /agendamentos
export const agendamentoFiltrosSchema = z.object({
  usuarioId: filtroId,
  ofertaId: filtroId,
  situacao: z.preprocess(
    vazioParaUndefined,
    z
      .enum(SITUACOES_AGENDAMENTO, {
        error: "Situacao invalida.",
      })
      .optional(),
  ),
  monitor: z.preprocess(
    vazioParaUndefined,
    z.string().trim().min(1).max(120).optional(),
  ),
  _order: z.preprocess(
    vazioParaUndefined,
    z.enum(["asc", "desc"]).optional().default("asc"),
  ),
});

// Header Idempotency-Key
export const idempotencyKeySchema = z
  .string()
  .trim()
  .min(8, "Idempotency-Key deve ter pelo menos 8 caracteres.")
  .max(100, "Idempotency-Key deve ter no maximo 100 caracteres.");
