import express from "express";
import { candidaturas } from "../data/candidaturas.js";
import { oportunidades } from "../data/oportunidades.js";
import {
  candidaturaCriacaoSchema,
  candidaturaAtualizacaoSchema,
  candidaturaFiltrosSchema,
} from "../schemas/candidaturaSchema.js";

const router = express.Router();

/* ------------------------------- AUXILIARES ------------------------------ */

// Valida os dados com Zod.
// Se houver erro, responde 400 e interrompe a operacao.
function validar(schema, dados, res) {
  const resultado = schema.safeParse(dados ?? {});

  if (resultado.success) {
    return resultado.data;
  }

  const erros = resultado.error.issues.map((erro) => ({
    campo: erro.path.join(".") || null,
    mensagem: erro.message,
  }));

  res.status(400).json({
    mensagem: erros[0].mensagem,
    erros,
  });

  return null;
}

/* ---------------------------------- READ --------------------------------- */

// GET /candidaturas
router.get("/", (req, res) => {
  const filtros = validar(
    candidaturaFiltrosSchema,
    req.query,
    res,
  );

  if (!filtros) return;

  const {
    usuarioId,
    oportunidadeId,
    situacao,
  } = filtros;

  let lista = [...candidaturas];

  if (usuarioId) {
    lista = lista.filter(
      (candidatura) =>
        candidatura.usuarioId === usuarioId,
    );
  }

  if (oportunidadeId) {
    lista = lista.filter(
      (candidatura) =>
        candidatura.oportunidadeId ===
        oportunidadeId,
    );
  }

  if (situacao) {
    lista = lista.filter(
      (candidatura) =>
        candidatura.situacao === situacao,
    );
  }

  res.json(lista);
});

/* --------------------------------- CREATE -------------------------------- */

// POST /candidaturas
router.post("/", (req, res) => {
  const dados = validar(
    candidaturaCriacaoSchema,
    req.body,
    res,
  );

  if (!dados) return;

  const {
    usuarioId,
    oportunidadeId,
    carta,
  } = dados;

  const oportunidade = oportunidades.find(
    (item) => item.id === oportunidadeId,
  );

  if (!oportunidade) {
    return res
      .status(404)
      .json({
        mensagem:
          "Oportunidade nao encontrada.",
      });
  }

  const candidaturaExistente =
    candidaturas.find(
      (item) =>
        item.usuarioId === usuarioId &&
        item.oportunidadeId ===
          oportunidadeId,
    );

  if (candidaturaExistente) {
    return res
      .status(409)
      .json({
        mensagem:
          "Voce ja se candidatou a esta oportunidade.",
      });
  }

  const novoId =
    candidaturas.length > 0
      ? Math.max(
          ...candidaturas.map(
            (item) => item.id,
          ),
        ) + 1
      : 1;

  const novaCandidatura = {
    id: novoId,
    usuarioId,
    oportunidadeId,
    oportunidadeTitulo:
      oportunidade.titulo,
    tipo: oportunidade.tipo,
    dataEnvio: new Date()
      .toISOString()
      .slice(0, 10),
    situacao: "Em analise",
    carta,
  };

  candidaturas.push(novaCandidatura);

  res.status(201).json(novaCandidatura);
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /candidaturas/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = candidaturas.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({
        mensagem:
          "Candidatura nao encontrada.",
      });
  }

  const dados = validar(
    candidaturaAtualizacaoSchema,
    req.body,
    res,
  );

  if (!dados) return;

  candidaturas[indice] = {
    ...candidaturas[indice],
    ...dados,
    id,
  };

  res.json(candidaturas[indice]);
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /candidaturas/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = candidaturas.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({
        mensagem:
          "Candidatura nao encontrada.",
      });
  }

  candidaturas.splice(indice, 1);

  res.status(204).send();
});

export default router;