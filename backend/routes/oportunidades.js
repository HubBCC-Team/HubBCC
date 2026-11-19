import express from "express";
import { oportunidades } from "../data/oportunidades.js";
import {
  oportunidadeCriacaoSchema,
  oportunidadeAtualizacaoSchema,
  oportunidadeFiltrosSchema,
} from "../schemas/oportunidadeSchema.js";

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

// GET /oportunidades
router.get("/", (req, res) => {
  const filtros = validar(
    oportunidadeFiltrosSchema,
    req.query,
    res,
  );

  if (!filtros) return;

  const {
    busca,
    tipo,
    modalidade,
    situacao,
  } = filtros;

  let lista = [...oportunidades];

  if (busca) {
    const termo = busca.toLowerCase();

    lista = lista.filter(
      (oportunidade) =>
        oportunidade.titulo
          .toLowerCase()
          .includes(termo) ||
        oportunidade.area
          .toLowerCase()
          .includes(termo) ||
        oportunidade.descricao
          .toLowerCase()
          .includes(termo),
    );
  }

  if (tipo) {
    lista = lista.filter(
      (oportunidade) =>
        oportunidade.tipo === tipo,
    );
  }

  if (modalidade) {
    lista = lista.filter(
      (oportunidade) =>
        oportunidade.modalidade === modalidade,
    );
  }

  if (situacao) {
    lista = lista.filter(
      (oportunidade) =>
        oportunidade.situacao === situacao,
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
      .json({
        mensagem:
          "Oportunidade nao encontrada.",
      });
  }

  res.json(oportunidade);
});

/* --------------------------------- CREATE -------------------------------- */

// POST /oportunidades
router.post("/", (req, res) => {
  const dados = validar(
    oportunidadeCriacaoSchema,
    req.body,
    res,
  );

  if (!dados) return;

  const novoId =
    oportunidades.length > 0
      ? Math.max(
          ...oportunidades.map(
            (item) => item.id,
          ),
        ) + 1
      : 1;

  const novaOportunidade = {
    id: novoId,
    ...dados,
    situacao: "Aberta",
  };

  oportunidades.push(novaOportunidade);

  res.status(201).json(novaOportunidade);
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /oportunidades/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = oportunidades.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({
        mensagem:
          "Oportunidade nao encontrada.",
      });
  }

  const dados = validar(
    oportunidadeAtualizacaoSchema,
    req.body,
    res,
  );

  if (!dados) return;

  oportunidades[indice] = {
    ...oportunidades[indice],
    ...dados,
    id,
  };

  res.json(oportunidades[indice]);
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /oportunidades/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = oportunidades.findIndex(
    (item) => item.id === id,
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({
        mensagem:
          "Oportunidade nao encontrada.",
      });
  }

  oportunidades.splice(indice, 1);

  res.status(204).send();
});

export default router;