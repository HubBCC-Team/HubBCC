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

export default router;
