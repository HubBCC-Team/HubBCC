import express from "express";

import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import { autorizarPerfis } from "../middlewares/autorizacao.js";

import {
  oportunidadeCriacaoSchema,
  oportunidadeAtualizacaoSchema,
  oportunidadeFiltrosSchema,
} from "../schemas/oportunidadeSchema.js";

const router = express.Router();

/* ------------------------------- AUXILIARES ------------------------------ */

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

function formatarOportunidade(oportunidade) {
  return {
    ...oportunidade,

    prazoInscricao:
      oportunidade.prazoInscricao
        .toISOString()
        .slice(0, 10),
  };
}

function converterData(data) {
  return new Date(
    `${data}T00:00:00.000Z`,
  );
}

function podeGerenciar(
  oportunidade,
  usuario,
) {
  if (usuario.perfil === "admin") {
    return true;
  }

  return (
    oportunidade.criadorId ===
    usuario.id
  );
}

/* ---------------------------------- READ --------------------------------- */

// GET /oportunidades
router.get(
  "/",
  autenticar,
  async (req, res) => {
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

    const where = {};

    if (busca) {
      where.OR = [
        {
          titulo: {
            contains: busca,
            mode: "insensitive",
          },
        },
        {
          area: {
            contains: busca,
            mode: "insensitive",
          },
        },
        {
          descricao: {
            contains: busca,
            mode: "insensitive",
          },
        },
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (modalidade) {
      where.modalidade = modalidade;
    }

    if (situacao) {
      where.situacao = situacao;
    }

    try {
      const oportunidades =
        await prisma.oportunidade.findMany({
          where,

          orderBy: {
            id: "asc",
          },
        });

      res.json(
        oportunidades.map(
          formatarOportunidade,
        ),
      );
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao consultar oportunidades.",
      });
    }
  },
);

// GET /oportunidades/:id
router.get(
  "/:id",
  autenticar,
  async (req, res) => {
    const id = Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem: "Id invalido.",
      });
    }

    try {
      const oportunidade =
        await prisma.oportunidade.findUnique({
          where: {
            id,
          },
        });

      if (!oportunidade) {
        return res.status(404).json({
          mensagem:
            "Oportunidade nao encontrada.",
        });
      }

      res.json(
        formatarOportunidade(
          oportunidade,
        ),
      );
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao consultar oportunidade.",
      });
    }
  },
);

/* --------------------------------- CREATE -------------------------------- */

// POST /oportunidades
router.post(
  "/",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const dados = validar(
      oportunidadeCriacaoSchema,
      req.body,
      res,
    );

    if (!dados) return;

    try {
      const novaOportunidade =
        await prisma.oportunidade.create({
          data: {
            ...dados,

            prazoInscricao:
              converterData(
                dados.prazoInscricao,
              ),

            situacao: "Aberta",

            // O dono vem do JWT,
            // nunca do corpo enviado.
            criadorId:
              req.usuario.id,
          },
        });

      res
        .status(201)
        .json(
          formatarOportunidade(
            novaOportunidade,
          ),
        );
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao cadastrar oportunidade.",
      });
    }
  },
);

/* --------------------------------- UPDATE -------------------------------- */

// PUT /oportunidades/:id
router.put(
  "/:id",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const id = Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem: "Id invalido.",
      });
    }

    const dados = validar(
      oportunidadeAtualizacaoSchema,
      req.body,
      res,
    );

    if (!dados) return;

    try {
      const oportunidadeExistente =
        await prisma.oportunidade.findUnique({
          where: {
            id,
          },
        });

      if (!oportunidadeExistente) {
        return res.status(404).json({
          mensagem:
            "Oportunidade nao encontrada.",
        });
      }

      if (
        !podeGerenciar(
          oportunidadeExistente,
          req.usuario,
        )
      ) {
        return res.status(403).json({
          mensagem:
            "Voce nao tem permissao para alterar esta oportunidade.",
        });
      }

      const dadosAtualizados = {
        ...dados,
      };

      if (dados.prazoInscricao) {
        dadosAtualizados.prazoInscricao =
          converterData(
            dados.prazoInscricao,
          );
      }

      const oportunidade =
        await prisma.oportunidade.update({
          where: {
            id,
          },

          data: dadosAtualizados,
        });

      res.json(
        formatarOportunidade(
          oportunidade,
        ),
      );
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao alterar oportunidade.",
      });
    }
  },
);

/* --------------------------------- DELETE -------------------------------- */

// DELETE /oportunidades/:id
router.delete(
  "/:id",
  autenticar,
  autorizarPerfis("monitor", "admin"),
  async (req, res) => {
    const id = Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem: "Id invalido.",
      });
    }

    try {
      const oportunidade =
        await prisma.oportunidade.findUnique({
          where: {
            id,
          },
        });

      if (!oportunidade) {
        return res.status(404).json({
          mensagem:
            "Oportunidade nao encontrada.",
        });
      }

      if (
        !podeGerenciar(
          oportunidade,
          req.usuario,
        )
      ) {
        return res.status(403).json({
          mensagem:
            "Voce nao tem permissao para excluir esta oportunidade.",
        });
      }

      await prisma.oportunidade.delete({
        where: {
          id,
        },
      });

      res.status(204).send();
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao excluir oportunidade.",
      });
    }
  },
);

export default router;