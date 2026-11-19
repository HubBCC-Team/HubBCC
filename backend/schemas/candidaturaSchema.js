/* ---------------------------------------------------------------------------
   schemas/candidaturaSchema.js
   Validacao ZOD de CANDIDATURAS.                         Responsavel: Marina

   - candidaturaCriacaoSchema      -> POST /candidaturas
   - candidaturaAtualizacaoSchema  -> PUT  /candidaturas/:id
   - candidaturaFiltrosSchema      -> query string do GET /candidaturas

   Campos como id, dataEnvio, situacao inicial e dados da oportunidade
   continuam sendo definidos pelo servidor.
--------------------------------------------------------------------------- */

import { z } from "zod";

export const SITUACOES_CANDIDATURA = [
  "Em analise",
  "Aprovada",
  "Reprovada",
];

export const CARTA_MINIMO = 30;
export const CARTA_MAXIMO = 2000;

const idPositivo = z.coerce
  .number({
    error: "Informe um identificador valido.",
  })
  .int("O identificador deve ser inteiro.")
  .positive("O identificador deve ser positivo.");

const filtroId = z.preprocess(
  (valor) =>
    valor === "" || valor === undefined
      ? undefined
      : valor,
  idPositivo.optional(),
);

const filtroSituacao = z.preprocess(
  (valor) =>
    valor === "" || valor === undefined
      ? undefined
      : valor,
  z.enum(SITUACOES_CANDIDATURA).optional(),
);

// POST /candidaturas
export const candidaturaCriacaoSchema =
  z.object({
    usuarioId: idPositivo,

    oportunidadeId: idPositivo,

    carta: z
      .string()
      .trim()
      .min(
        1,
        "Escreva sua carta de motivacao.",
      )
      .min(
        CARTA_MINIMO,
        `A carta deve ter pelo menos ${CARTA_MINIMO} caracteres.`,
      )
      .max(
        CARTA_MAXIMO,
        `A carta deve ter no maximo ${CARTA_MAXIMO} caracteres.`,
      ),
  });

// PUT /candidaturas/:id
// A avaliacao feita pelo monitor pode somente aprovar ou reprovar.
export const candidaturaAtualizacaoSchema =
  z.object({
    situacao: z.enum(
      ["Aprovada", "Reprovada"],
      {
        error:
          "A situacao deve ser Aprovada ou Reprovada.",
      },
    ),
  });

// GET /candidaturas
export const candidaturaFiltrosSchema =
  z.object({
    usuarioId: filtroId,

    oportunidadeId: filtroId,

    situacao: filtroSituacao,
  });