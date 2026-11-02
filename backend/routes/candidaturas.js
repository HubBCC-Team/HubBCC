import express from "express";
import { candidaturas } from "../data/candidaturas.js";
import { oportunidades } from "../data/oportunidades.js";

const router = express.Router();

// GET /candidaturas
router.get("/", (req, res) => {
  const {
    usuarioId,
    oportunidadeId,
    situacao = "",
  } = req.query;

  let lista = [...candidaturas];

  if (usuarioId) {
    lista = lista.filter(
      (candidatura) =>
        candidatura.usuarioId === Number(usuarioId),
    );
  }

  if (oportunidadeId) {
    lista = lista.filter(
      (candidatura) =>
        candidatura.oportunidadeId === Number(oportunidadeId),
    );
  }

  if (situacao) {
    lista = lista.filter(
      (candidatura) => candidatura.situacao === situacao,
    );
  }

  res.json(lista);
});

// POST /candidaturas
router.post("/", (req, res) => {
  const usuarioId = Number(req.body.usuarioId);
  const oportunidadeId = Number(req.body.oportunidadeId);
  const carta = req.body.carta;

  const oportunidade = oportunidades.find(
    (item) => item.id === oportunidadeId,
  );

  if (!oportunidade) {
    return res
      .status(404)
      .json({ mensagem: "Oportunidade nao encontrada." });
  }

  const candidaturaExistente = candidaturas.find(
    (item) =>
      item.usuarioId === usuarioId &&
      item.oportunidadeId === oportunidadeId,
  );

  if (candidaturaExistente) {
    return res
      .status(409)
      .json({
        mensagem: "Voce ja se candidatou a esta oportunidade.",
      });
  }

  const novoId =
    candidaturas.length > 0
      ? Math.max(...candidaturas.map((item) => item.id)) + 1
      : 1;

  const novaCandidatura = {
    id: novoId,
    usuarioId,
    oportunidadeId,
    oportunidadeTitulo: oportunidade.titulo,
    tipo: oportunidade.tipo,
    dataEnvio: new Date().toISOString().slice(0, 10),
    situacao: "Em analise",
    carta,
  };

  candidaturas.push(novaCandidatura);

  res.status(201).json(novaCandidatura);
});

// PUT /candidaturas/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = candidaturas.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensagem: "Candidatura nao encontrada." });
  }

  candidaturas[indice] = {
    ...candidaturas[indice],
    ...req.body,
    id,
  };

  res.json(candidaturas[indice]);
});

// DELETE /candidaturas/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = candidaturas.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensagem: "Candidatura nao encontrada." });
  }

  candidaturas.splice(indice, 1);

  res.status(204).send();
});

export default router;
