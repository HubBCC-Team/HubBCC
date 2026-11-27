import express from "express";
import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import { autorizarPerfis } from "../middlewares/autorizacao.js";
import {
  validar,
  idDaRota,
  naoEncontrado,
  conflito,
  erroInterno,
} from "../lib/http.js";
import {
  disciplinaCriacaoSchema,
  disciplinaAtualizacaoSchema,
  disciplinaFiltrosSchema,
} from "../schemas/disciplinaSchema.js";

const router = express.Router();

// GET /disciplinas
router.get("/", autenticar, async (req, res) => {
  const filtros = validar(disciplinaFiltrosSchema, req.query, res);
  if (!filtros) return;

  const where = {};
  if (filtros.ativa !== undefined) where.ativa = filtros.ativa === "true";
  if (filtros.busca) {
    where.OR = [
      { nome: { contains: filtros.busca, mode: "insensitive" } },
      { codigo: { contains: filtros.busca, mode: "insensitive" } },
    ];
  }

  try {
    const lista = await prisma.disciplina.findMany({
      where,
      orderBy: { nome: "asc" },
    });
    res.json(lista);
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /disciplinas/:id
router.get("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const disciplina = await prisma.disciplina.findUnique({ where: { id } });
    if (!disciplina) return naoEncontrado(res, "Disciplina nao encontrada.");
    res.json(disciplina);
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// POST /disciplinas
router.post(
  "/",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const dados = validar(disciplinaCriacaoSchema, req.body, res);
    if (!dados) return;

    try {
      const existente = await prisma.disciplina.findFirst({
        where: { nome: { equals: dados.nome, mode: "insensitive" } },
      });
      if (existente) {
        return conflito(
          res,
          "Ja existe uma disciplina cadastrada com este nome.",
        );
      }

      const nova = await prisma.disciplina.create({ data: dados });
      res.status(201).json(nova);
    } catch (erro) {
      if (erro?.code === "P2002") {
        return conflito(res, "Disciplina ou codigo ja cadastrado.");
      }
      erroInterno(res, erro);
    }
  },
);

// PUT /disciplinas/:id
router.put(
  "/:id",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const id = idDaRota(req, res);
    if (!id) return;

    const dados = validar(disciplinaAtualizacaoSchema, req.body, res);
    if (!dados) return;

    try {
      const atual = await prisma.disciplina.findUnique({ where: { id } });
      if (!atual) return naoEncontrado(res, "Disciplina nao encontrada.");

      if (dados.nome) {
        const duplicada = await prisma.disciplina.findFirst({
          where: {
            id: { not: id },
            nome: { equals: dados.nome, mode: "insensitive" },
          },
        });
        if (duplicada) {
          return conflito(
            res,
            "Ja existe uma disciplina cadastrada com este nome.",
          );
        }
      }

      const atualizada = await prisma.disciplina.update({
        where: { id },
        data: dados,
      });
      res.json(atualizada);
    } catch (erro) {
      if (erro?.code === "P2002") {
        return conflito(res, "Disciplina ou codigo ja cadastrado.");
      }
      erroInterno(res, erro);
    }
  },
);

// DELETE /disciplinas/:id
router.delete(
  "/:id",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const id = idDaRota(req, res);
    if (!id) return;

    try {
      const atual = await prisma.disciplina.findUnique({
        where: { id },
        include: { _count: { select: { atividades: true } } },
      });
      if (!atual) return naoEncontrado(res, "Disciplina nao encontrada.");

      if (atual._count.atividades > 0) {
        return conflito(
          res,
          "Nao e possivel excluir: existem atividades vinculadas a esta disciplina.",
        );
      }

      await prisma.disciplina.delete({ where: { id } });
      res.status(204).send();
    } catch (erro) {
      erroInterno(res, erro);
    }
  },
);

export default router;
