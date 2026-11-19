import express from "express";

import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import { autorizarPerfis } from "../middlewares/autorizacao.js";

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
router.get(
  "/",
  autenticar,
  async (req, res) => {
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

    /*
      ALUNO:
      sempre consulta somente as proprias candidaturas.
      Mesmo que tente enviar outro usuarioId pela URL,
      o backend ignora e usa o id do JWT.
    */
    if (req.usuario.perfil === "aluno") {
      where.usuarioId =
        req.usuario.id;
    }

    /*
      MONITOR:
      so consulta candidaturas de oportunidades
      criadas por ele.
    */
    else if (
      req.usuario.perfil === "monitor"
    ) {
      where.oportunidade = {
        is: {
          criadorId:
            req.usuario.id,
        },
      };

      if (usuarioId) {
        where.usuarioId = usuarioId;
      }
    }

    /*
      ADMIN:
      pode consultar todas e usar os filtros.
    */
    else if (
      req.usuario.perfil === "admin"
    ) {
      if (usuarioId) {
        where.usuarioId = usuarioId;
      }
    }

    else {
      return res.status(403).json({
        mensagem:
          "Voce nao tem permissao para esta acao.",
      });
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
  },
);

/* --------------------------------- CREATE -------------------------------- */

// POST /candidaturas
router.post(
  "/",
  autenticar,
  autorizarPerfis("aluno"),
  async (req, res) => {
    /*
      O usuarioId do body nao e confiavel.
      O backend substitui pelo usuario autenticado.
    */
    const dados = validar(
      candidaturaCriacaoSchema,
      {
        ...req.body,
        usuarioId:
          req.usuario.id,
      },
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
        return res.status(404).json({
          mensagem:
            "Oportunidade nao encontrada.",
        });
      }

      if (
        oportunidade.situacao !==
        "Aberta"
      ) {
        return res.status(409).json({
          mensagem:
            "Esta oportunidade esta encerrada.",
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
        return res.status(409).json({
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
  },
);

/* --------------------------------- UPDATE -------------------------------- */

// PUT /candidaturas/:id
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

          include: {
            oportunidade: {
              select: {
                criadorId: true,
              },
            },
          },
        });

      if (!candidaturaExistente) {
        return res.status(404).json({
          mensagem:
            "Candidatura nao encontrada.",
        });
      }

      /*
        Monitor so pode avaliar candidaturas
        das oportunidades que ele criou.
        Admin pode avaliar qualquer uma.
      */
      if (
        req.usuario.perfil ===
          "monitor" &&
        candidaturaExistente
          .oportunidade
          .criadorId !==
          req.usuario.id
      ) {
        return res.status(403).json({
          mensagem:
            "Voce nao tem permissao para avaliar esta candidatura.",
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
  },
);

/* --------------------------------- DELETE -------------------------------- */

// DELETE /candidaturas/:id
router.delete(
  "/:id",
  autenticar,
  autorizarPerfis("aluno", "admin"),
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
      const candidatura =
        await prisma.candidatura.findUnique({
          where: {
            id,
          },
        });

      if (!candidatura) {
        return res.status(404).json({
          mensagem:
            "Candidatura nao encontrada.",
        });
      }

      /*
        Aluno so pode cancelar
        a propria candidatura.
        Admin pode excluir qualquer uma.
      */
      if (
        req.usuario.perfil ===
          "aluno" &&
        candidatura.usuarioId !==
          req.usuario.id
      ) {
        return res.status(403).json({
          mensagem:
            "Voce nao tem permissao para cancelar esta candidatura.",
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
  },
);

export default router;