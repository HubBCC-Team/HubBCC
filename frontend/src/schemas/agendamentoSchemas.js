/* ---------------------------------------------------------------------------
   schemas/agendamentoSchemas.js
   SCHEMAS ZOD dos AGENDAMENTOS (casos de uso 14 a 18).

   - agendamentoSchema        -> RealizarAgendamento (dia + horario)
   - reagendamentoSchema      -> modal Reagendar
   - avaliacaoSchema          -> modal Avaliar
   - registroAtendimentoSchema-> RegistrarAtendimento
--------------------------------------------------------------------------- */
import { z } from "zod";

// Data de hoje em AAAA-MM-DD no fuso LOCAL (toISOString usaria UTC).
export function hojeLocalISO() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

const dataFutura = (rotulo) =>
  z
    .string()
    .min(1, `Selecione ${rotulo}.`)
    .refine((data) => data >= hojeLocalISO(), "A data nao pode estar no passado.");

const hora = (rotulo) =>
  z
    .string()
    .min(1, `Selecione ${rotulo}.`)
    .regex(/^\d{2}:\d{2}$/, "Horario invalido.");

/* ------------------------- Realizar agendamento -------------------------- */
export const agendamentoSchema = z.object({
  data: dataFutura("um dia no calendario"),
  hora: hora("um horario"),
});

/* ------------------------------ Reagendar -------------------------------- */
export const reagendamentoSchema = z.object({
  data: dataFutura("a nova data"),
  hora: hora("o novo horario"),
});

/* ------------------------------- Avaliar --------------------------------- */
export const TAGS_AVALIACAO = ["Didatico", "Pontual", "Paciente", "Claro", "Atencioso"];

export const avaliacaoSchema = z.object({
  nota: z.number().int().min(1, "Escolha de 1 a 5 estrelas.").max(5),
  tags: z.array(z.enum(TAGS_AVALIACAO)).default([]),
  comentario: z.string().trim().max(500, "Maximo de 500 caracteres.").optional().default(""),
});

/* ------------------------- Registrar atendimento ------------------------- */
export const registroAtendimentoSchema = z
  .object({
    compareceu: z.boolean(),
    duracao: z.coerce
      .number({ error: "Informe a duracao em minutos." })
      .int("Use minutos inteiros.")
      .min(0, "A duracao nao pode ser negativa.")
      .max(480, "Maximo de 480 minutos (8 horas)."),
    observacoes: z.string().trim().max(1000, "Maximo de 1000 caracteres.").optional().default(""),
  })
  // Se o aluno compareceu, a sessao precisa ter durado algum tempo.
  .refine((dados) => !dados.compareceu || dados.duracao >= 15, {
    message: "Se o aluno compareceu, informe pelo menos 15 minutos.",
    path: ["duracao"],
  })
  // Se nao compareceu, a duracao registrada e zero.
  .transform((dados) => ({ ...dados, duracao: dados.compareceu ? dados.duracao : 0 }));
