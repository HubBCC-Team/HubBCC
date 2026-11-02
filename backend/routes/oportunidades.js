import express from "express";
import { oportunidades } from "../data/oportunidades.js";

const router = express.Router();

// GET /oportunidades
router.get("/", (req, res) => {
  const {
    busca = "",
    tipo = "",
    modalidade = "",
    situacao = "",
  } = req.query;

  let lista = [...oportunidades];

  if (busca) {
    const termo = busca.toLowerCase();

    lista = lista.filter(
      (oportunidade) =>
        oportunidade.titulo.toLowerCase().includes(termo) ||
        oportunidade.area.toLowerCase().includes(termo) ||
        oportunidade.descricao.toLowerCase().includes(termo),
    );
  }

  if (tipo) {
    lista = lista.filter(
      (oportunidade) => oportunidade.tipo === tipo,
    );
  }

  if (modalidade) {
    lista = lista.filter(
      (oportunidade) => oportunidade.modalidade === modalidade,
    );
  }

  if (situacao) {
    lista = lista.filter(
      (oportunidade) => oportunidade.situacao === situacao,
    );
  }

  res.json(lista);
});

// GET /oportunidades/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const oportunidade = oportunidades.find(
    (item) => item.id === id,
  );

  if (!oportunidade) {
    return res
      .status(404)
      .json({ mensagem: "Oportunidade nao encontrada." });
  }

  res.json(oportunidade);
});

// POST /oportunidades
router.post("/", (req, res) => {
  const dados = req.body;

  const novoId =
    oportunidades.length > 0
      ? Math.max(...oportunidades.map((item) => item.id)) + 1
      : 1;

  const novaOportunidade = {
    id: novoId,
    ...dados,
  };

  oportunidades.push(novaOportunidade);

  res.status(201).json(novaOportunidade);
});

// PUT /oportunidades/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = oportunidades.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensagem: "Oportunidade nao encontrada." });
  }

  oportunidades[indice] = {
    ...oportunidades[indice],
    ...req.body,
    id,
  };

  res.json(oportunidades[indice]);
});

// DELETE /oportunidades/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = oportunidades.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensagem: "Oportunidade nao encontrada." });
  }

  oportunidades.splice(indice, 1);

  res.status(204).send();
});

export default router;
