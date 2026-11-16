/* ---------------------------------------------------------------------------
   schemas/ofertaSchema.js
   Validacao ZOD da OFERTA DE APOIO.                       Responsavel: Mina

   - ofertaCriacaoSchema      -> POST /ofertas
   - ofertaAtualizacaoSchema  -> PUT  /ofertas/:id (todos os campos opcionais)
   - ofertaFiltrosSchema      -> query string do GET /ofertas

   SEGURANCA: o z.object() DESCARTA chaves que nao estao no schema.
   Se alguem enviar id, monitorId, vagasOcupadas ou nota no corpo, esses
   campos somem antes de chegar no array.
--------------------------------------------------------------------------- */
import { z } from "zod";

export const TIPOS_OFERTA = ["Monitoria", "Tutoria"];
export const MODALIDADES_OFERTA = ["Presencial", "Remoto", "Hibrido"];

// Um bloco da grade de horarios: { id: "Segunda-14:00", dia, inicio, fim }
const horarioSchema = z.object({
  id: z.union([z.string(), z.number()]),
  dia: z.string().min(1),
  inicio: z.string().regex(/^\d{2}:\d{2}$/, "Horario invalido."),
  fim: z.string().regex(/^\d{2}:\d{2}$/, "Horario invalido."),
});

// Regras de cada campo, SEM valores padrao (para o .partial() da atualizacao
// nao preencher campos que o usuario nao enviou).
const ofertaBase = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, "O titulo deve ter pelo menos 5 caracteres.")
    .max(100, "Maximo de 100 caracteres."),
  disciplinaId: z.coerce
    .number({ error: "Selecione a disciplina." })
    .int("Selecione a disciplina.")
    .positive("Selecione a disciplina."),
  disciplina: z.string().trim().max(100).optional(), // nome da disciplina
  tipo: z.enum(TIPOS_OFERTA, { error: "Selecione o tipo." }),
  assunto: z
    .string()
    .trim()
    .min(3, "Descreva os assuntos abordados.")
    .max(150, "Maximo de 150 caracteres."),
  modalidade: z.enum(MODALIDADES_OFERTA, { error: "Selecione a modalidade." }),
  local: z
    .string()
    .trim()
    .min(1, "Informe o local ou o link do atendimento.")
    .max(120, "Maximo de 120 caracteres."),
  vagas: z.coerce
    .number({ error: "Informe a quantidade de vagas." })
    .int("Use um numero inteiro.")
    .min(1, "Minimo de 1 vaga.")
    .max(50, "Maximo de 50 vagas."),
  gratuita: z.boolean(),
  valor: z.coerce
    .number({ error: "Informe um valor valido." })
    .min(0, "O valor nao pode ser negativo.")
    .max(1000, "Valor muito alto."),
  descricao: z.string().trim().max(1000, "Maximo de 1000 caracteres.").optional(),
  horarios: z.array(horarioSchema).min(1, "Selecione ao menos um horario de atendimento."),
});

// CRIACAO: oferta paga precisa de valor; gratuita grava valor 0.
export const ofertaCriacaoSchema = ofertaBase
  .refine((d) => d.gratuita || d.valor > 0, {
    message: "Informe o valor por atendimento.",
    path: ["valor"],
  })
  .transform((d) => ({
    ...d,
    valor: d.gratuita ? 0 : d.valor,
    descricao: d.descricao ?? "",
    disciplina: d.disciplina ?? "",
  }));

// ATUALIZACAO: so o que mudou. A regra de valor e conferida na rota,
// porque depende do que ja esta salvo.
export const ofertaAtualizacaoSchema = ofertaBase
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Envie ao menos um campo para alterar.",
  });

// FILTROS: tudo que chega pela query string e texto.
export const ofertaFiltrosSchema = z.object({
  busca: z.string().trim().max(100).optional(),
  disciplinaId: z.string().trim().optional(),
  tipo: z.enum(TIPOS_OFERTA).optional(),
  modalidade: z.enum(MODALIDADES_OFERTA).optional(),
  gratuita: z.enum(["true", "false"]).optional(),
  monitorId: z.string().trim().optional(),
});
