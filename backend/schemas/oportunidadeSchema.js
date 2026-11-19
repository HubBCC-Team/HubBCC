/* ---------------------------------------------------------------------------
   schemas/oportunidadeSchema.js
   Validacao ZOD de OPORTUNIDADES.                        Responsavel: Marina

   - oportunidadeCriacaoSchema      -> POST /oportunidades
   - oportunidadeAtualizacaoSchema  -> PUT  /oportunidades/:id
   - oportunidadeFiltrosSchema      -> query string do GET /oportunidades

   O backend valida novamente os dados mesmo que o frontend ja tenha validado.
--------------------------------------------------------------------------- */

import { z } from "zod";

export const TIPOS_OPORTUNIDADE = [
  "Iniciacao Cientifica",
  "Extensao",
  "Evento",
  "Estagio",
  "Monitoria",
];

export const MODALIDADES_OPORTUNIDADE = [
  "Presencial",
  "Remoto",
  "Hibrido",
];

export const SITUACOES_OPORTUNIDADE = [
  "Aberta",
  "Encerrada",
];

function hojeISO() {
  const agora = new Date();

  agora.setMinutes(
    agora.getMinutes() - agora.getTimezoneOffset(),
  );

  return agora.toISOString().slice(0, 10);
}

const textoObrigatorio = (nome, minimo = 2) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${nome}.`)
    .min(
      minimo,
      `${nome[0].toUpperCase() + nome.slice(1)} muito curto(a).`,
    );

const listaTextoSchema = z
  .array(z.string().trim().min(1))
  .default([]);

const filtroEnum = (valores) =>
  z.preprocess(
    (valor) => (valor === "" ? undefined : valor),
    z.enum(valores).optional(),
  );

const oportunidadeBase = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Informe o titulo.")
    .min(
      5,
      "O titulo deve ter pelo menos 5 caracteres.",
    )
    .max(120, "Maximo de 120 caracteres."),

  tipo: z.enum(TIPOS_OPORTUNIDADE, {
    error: "Selecione o tipo.",
  }),

  area: textoObrigatorio("a area"),

  departamento: textoObrigatorio(
    "o departamento",
  ),

  responsavel: textoObrigatorio(
    "o responsavel",
    3,
  ),

  modalidade: z.enum(
    MODALIDADES_OPORTUNIDADE,
    {
      error: "Selecione a modalidade.",
    },
  ),

  local: textoObrigatorio("o local"),

  bolsa: z
    .string()
    .trim()
    .max(60, "Maximo de 60 caracteres.")
    .optional()
    .default(""),

  cargaHoraria: z
    .string()
    .trim()
    .max(40, "Maximo de 40 caracteres.")
    .optional()
    .default(""),

  vagas: z.coerce
    .number({
      error: "Informe a quantidade de vagas.",
    })
    .int("Use um numero inteiro.")
    .min(1, "Minimo de 1 vaga.")
    .max(500, "Maximo de 500 vagas."),

  prazoInscricao: z
    .string()
    .min(
      1,
      "Informe o prazo de inscricao.",
    ),

  descricao: z
    .string()
    .trim()
    .min(1, "Informe a descricao.")
    .min(
      20,
      "Descreva com pelo menos 20 caracteres.",
    )
    .max(2000, "Maximo de 2000 caracteres."),

  requisitos: listaTextoSchema,

  atividades: listaTextoSchema,
});

// POST /oportunidades
export const oportunidadeCriacaoSchema =
  oportunidadeBase.refine(
    (dados) =>
      dados.prazoInscricao >= hojeISO(),
    {
      message:
        "O prazo nao pode ser uma data passada.",
      path: ["prazoInscricao"],
    },
  );

// PUT /oportunidades/:id
export const oportunidadeAtualizacaoSchema =
  oportunidadeBase
    .partial()
    .extend({
      situacao: z
        .enum(SITUACOES_OPORTUNIDADE)
        .optional(),
    })
    .refine(
      (dados) =>
        Object.keys(dados).length > 0,
      {
        message:
          "Envie ao menos um campo para alterar.",
      },
    );

// GET /oportunidades
export const oportunidadeFiltrosSchema =
  z.object({
    busca: z
      .string()
      .trim()
      .max(100)
      .optional(),

    tipo: filtroEnum(
      TIPOS_OPORTUNIDADE,
    ),

    modalidade: filtroEnum(
      MODALIDADES_OPORTUNIDADE,
    ),

    situacao: filtroEnum(
      SITUACOES_OPORTUNIDADE,
    ),
  });