import express from "express";
import { prisma } from "../lib/prisma.js";
import {
  candidaturaCriacaoSchema,
  candidaturaAtualizacaoSchema,
  candidaturaFiltrosSchema,
} from "../schemas/candidaturaSchema.js";

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

function formatarCandidatura(candidatura) {
  const {
    oportunidade,
    ...dados
  } = candidatura;

  return {
    ...dados,
    dataEnvio: candidatura.dataEnvio
      .toISOString()
      .slice(0, 10),

    oportunidadeTitulo:
      oportunidade?.titulo ?? "",

    tipo:
      oportunidade?.tipo ?? "",
  };
}

/* ---------------------------------- READ --------------------------------- */

// GET /candidaturas
router.get("/", async (req, res) => {
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

  const where = {};

  if (usuarioId) {
    where.usuarioId = usuarioId;
  }

  if (oportunidadeId) {
    where.oportunidadeId =
      oportunidadeId;
  }

  if (situacao) {
    where.situacao = situacao;
  }

  try {
    const candidaturas =
      await prisma.candidatura.findMany({
        where,

        include: {
          oportunidade: {
            select: {
              titulo: true,
              tipo: true,
            },
          },
        },

        orderBy: {
          id: "asc",
        },
      });

    res.json(
      candidaturas.map(
        formatarCandidatura,
      ),
    );
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao consultar candidaturas.",
    });
  }
});

/* --------------------------------- CREATE -------------------------------- */

// POST /candidaturas
router.post("/", async (req, res) => {
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

  try {
    const oportunidade =
      await prisma.oportunidade.findUnique({
        where: {
          id: oportunidadeId,
        },
      });

    if (!oportunidade) {
      return res
        .status(404)
        .json({
          mensagem:
            "Oportunidade nao encontrada.",
        });
    }

    const candidaturaExistente =
      await prisma.candidatura.findUnique({
        where: {
          usuarioId_oportunidadeId: {
            usuarioId,
            oportunidadeId,
          },
        },
      });

    if (candidaturaExistente) {
      return res
        .status(409)
        .json({
          mensagem:
            "Voce ja se candidatou a esta oportunidade.",
        });
    }

    const novaCandidatura =
      await prisma.candidatura.create({
        data: {
          usuarioId,
          oportunidadeId,
          carta,
          situacao: "Em analise",
        },

        include: {
          oportunidade: {
            select: {
              titulo: true,
              tipo: true,
            },
          },
        },
      });

    res
      .status(201)
      .json(
        formatarCandidatura(
          novaCandidatura,
        ),
      );
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao cadastrar candidatura.",
    });
  }
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /candidaturas/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "Id invalido.",
    });
  }

  const dados = validar(
    candidaturaAtualizacaoSchema,
    req.body,
    res,
  );

  if (!dados) return;

  try {
    const candidaturaExistente =
      await prisma.candidatura.findUnique({
        where: {
          id,
        },
      });

    if (!candidaturaExistente) {
      return res
        .status(404)
        .json({
          mensagem:
            "Candidatura nao encontrada.",
        });
    }

    const candidatura =
      await prisma.candidatura.update({
        where: {
          id,
        },

        data: dados,

        include: {
          oportunidade: {
            select: {
              titulo: true,
              tipo: true,
            },
          },
        },
      });

    res.json(
      formatarCandidatura(
        candidatura,
      ),
    );
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao alterar candidatura.",
    });
  }
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /candidaturas/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "Id invalido.",
    });
  }

  try {
    const candidatura =
      await prisma.candidatura.findUnique({
        where: {
          id,
        },
      });

    if (!candidatura) {
      return res
        .status(404)
        .json({
          mensagem:
            "Candidatura nao encontrada.",
        });
    }

    await prisma.candidatura.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao excluir candidatura.",
    });
  }
});

export default router;