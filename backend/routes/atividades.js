import express from "express";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import { autorizarPerfis } from "../middlewares/autorizacao.js";
import {
  tratarUploadComprovante,
  PASTA_UPLOADS,
} from "../middlewares/upload.js";
import {
  validar,
  idDaRota,
  proibido,
  naoEncontrado,
  conflito,
  erroInterno,
} from "../lib/http.js";
import {
  atividadeCriacaoSchema,
  atividadeAtualizacaoSchema,
  atividadeAvaliacaoSchema,
  atividadeFiltrosSchema,
} from "../schemas/atividadeSchema.js";

const router = express.Router();

const META_HORAS = 200;

function formatarAtividade(atividade) {
  const { comprovantePath, ...resto } = atividade;
  return {
    ...resto,
    data: atividade.data.toISOString().slice(0, 10),
    temComprovante: Boolean(comprovantePath),
    comprovanteUrl: comprovantePath
      ? `/atividades/${atividade.id}/comprovante`
      : null,
  };
}

function apagarArquivoSilencioso(nomeArquivo) {
  if (!nomeArquivo) return;
  const caminho = path.join(PASTA_UPLOADS, path.basename(nomeArquivo));
  fs.promises.unlink(caminho).catch(() => {});
}

const ehAdmin = (u) => u.perfil === "admin";
const ehDono = (u, a) => a.usuarioId === u.id;

// GET /atividades/resumo?usuarioId=
router.get("/resumo", autenticar, async (req, res) => {
  const filtros = validar(atividadeFiltrosSchema, req.query, res);
  if (!filtros) return;

  const alvoId =
    ehAdmin(req.usuario) && filtros.usuarioId
      ? filtros.usuarioId
      : req.usuario.id;

  try {
    const lista = await prisma.atividade.findMany({
      where: { usuarioId: alvoId },
    });

    const horasAprovadas = lista
      .filter((a) => a.situacao === "Aprovada")
      .reduce((total, a) => total + a.horas, 0);

    const porCategoria = {};
    lista.forEach((a) => {
      porCategoria[a.categoria] = (porCategoria[a.categoria] ?? 0) + a.horas;
    });

    res.json({
      horasAprovadas,
      meta: META_HORAS,
      percentual: Math.round((horasAprovadas / META_HORAS) * 100),
      porCategoria,
      totalAtividades: lista.length,
    });
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /atividades?usuarioId=&categoria=&situacao=&busca=
router.get("/", autenticar, async (req, res) => {
  const filtros = validar(atividadeFiltrosSchema, req.query, res);
  if (!filtros) return;

  const where = {};
  if (req.usuario.perfil === "aluno") {
    where.usuarioId = req.usuario.id;
  } else if (filtros.usuarioId) {
    where.usuarioId = filtros.usuarioId;
  }

  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.situacao) where.situacao = filtros.situacao;
  if (filtros.busca) {
    where.OR = [
      { titulo: { contains: filtros.busca, mode: "insensitive" } },
      { descricao: { contains: filtros.busca, mode: "insensitive" } },
    ];
  }

  try {
    const lista = await prisma.atividade.findMany({
      where,
      orderBy: [{ data: "desc" }, { id: "desc" }],
    });
    res.json(lista.map(formatarAtividade));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /atividades/:id/comprovante (acesso protegido ao arquivo)
router.get("/:id/comprovante", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atividade = await prisma.atividade.findUnique({ where: { id } });
    if (!atividade) return naoEncontrado(res, "Atividade nao encontrada.");

    if (!ehAdmin(req.usuario) && !ehDono(req.usuario, atividade)) {
      return proibido(res);
    }

    if (!atividade.comprovantePath) {
      return naoEncontrado(
        res,
        "Esta atividade nao possui comprovante anexado.",
      );
    }

    const caminhoSeguro = path.join(
      PASTA_UPLOADS,
      path.basename(atividade.comprovantePath),
    );
    if (!fs.existsSync(caminhoSeguro)) {
      return naoEncontrado(
        res,
        "Arquivo do comprovante nao encontrado no servidor.",
      );
    }

    if (atividade.comprovanteMime) {
      res.type(atividade.comprovanteMime);
    }
    res.sendFile(caminhoSeguro);
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /atividades/:id
router.get("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atividade = await prisma.atividade.findUnique({ where: { id } });
    if (!atividade) return naoEncontrado(res, "Atividade nao encontrada.");
    if (!ehAdmin(req.usuario) && !ehDono(req.usuario, atividade))
      return proibido(res);

    res.json(formatarAtividade(atividade));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// POST /atividades (aceita multipart/form-data com campo "arquivo" ou JSON)
router.post("/", autenticar, tratarUploadComprovante, async (req, res) => {
  const dados = validar(atividadeCriacaoSchema, req.body, res);
  if (!dados) {
    if (req.file) apagarArquivoSilencioso(req.file.filename);
    return;
  }

  if (!req.file && !dados.comprovante) {
    return res
      .status(400)
      .json({ mensagem: "Anexe o comprovante da atividade." });
  }

  try {
    const nova = await prisma.atividade.create({
      data: {
        usuarioId: req.usuario.id,
        disciplinaId: dados.disciplinaId ?? null,
        categoria: dados.categoria,
        titulo: dados.titulo,
        data: new Date(`${dados.data}T00:00:00.000Z`),
        horas: dados.horas,
        descricao: dados.descricao,
        situacao: "Em analise",
        comprovante: req.file ? req.file.originalname : dados.comprovante,
        comprovantePath: req.file ? req.file.filename : null,
        comprovanteMime: req.file ? req.file.mimetype : null,
        comprovanteTamanho: req.file ? req.file.size : null,
      },
    });

    res.status(201).json(formatarAtividade(nova));
  } catch (erro) {
    if (req.file) apagarArquivoSilencioso(req.file.filename);
    erroInterno(res, erro);
  }
});

// PUT e PATCH /atividades/:id
async function atualizarAtividade(req, res) {
  const id = idDaRota(req, res);
  if (!id) {
    if (req.file) apagarArquivoSilencioso(req.file.filename);
    return;
  }

  try {
    const atual = await prisma.atividade.findUnique({ where: { id } });
    if (!atual) {
      if (req.file) apagarArquivoSilencioso(req.file.filename);
      return naoEncontrado(res, "Atividade nao encontrada.");
    }

    if (!ehAdmin(req.usuario) && !ehDono(req.usuario, atual)) {
      if (req.file) apagarArquivoSilencioso(req.file.filename);
      return proibido(res);
    }

    if (atual.situacao === "Aprovada" && !ehAdmin(req.usuario)) {
      if (req.file) apagarArquivoSilencioso(req.file.filename);
      return conflito(res, "Nao e possivel editar uma atividade ja aprovada.");
    }

    const dados = validar(atividadeAtualizacaoSchema, req.body, res);
    if (!dados) {
      if (req.file) apagarArquivoSilencioso(req.file.filename);
      return;
    }

    const dataAtualizacao = { ...dados };
    if (dados.data) {
      dataAtualizacao.data = new Date(`${dados.data}T00:00:00.000Z`);
    }

    if (req.file) {
      dataAtualizacao.comprovante = req.file.originalname;
      dataAtualizacao.comprovantePath = req.file.filename;
      dataAtualizacao.comprovanteMime = req.file.mimetype;
      dataAtualizacao.comprovanteTamanho = req.file.size;
    }

    const atualizada = await prisma.atividade.update({
      where: { id },
      data: dataAtualizacao,
    });

    if (req.file && atual.comprovantePath) {
      apagarArquivoSilencioso(atual.comprovantePath);
    }

    res.json(formatarAtividade(atualizada));
  } catch (erro) {
    if (req.file) apagarArquivoSilencioso(req.file.filename);
    erroInterno(res, erro);
  }
}

router.put("/:id", autenticar, tratarUploadComprovante, atualizarAtividade);
router.patch("/:id", autenticar, tratarUploadComprovante, atualizarAtividade);

// PATCH /atividades/:id/avaliar (admin aprova ou reprova)
router.patch(
  "/:id/avaliar",
  autenticar,
  autorizarPerfis("admin"),
  async (req, res) => {
    const id = idDaRota(req, res);
    if (!id) return;

    const dados = validar(atividadeAvaliacaoSchema, req.body, res);
    if (!dados) return;

    try {
      const atual = await prisma.atividade.findUnique({ where: { id } });
      if (!atual) return naoEncontrado(res, "Atividade nao encontrada.");

      const atualizada = await prisma.atividade.update({
        where: { id },
        data: { situacao: dados.situacao, observacao: dados.observacao },
      });

      res.json(formatarAtividade(atualizada));
    } catch (erro) {
      erroInterno(res, erro);
    }
  },
);

// DELETE /atividades/:id
router.delete("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atual = await prisma.atividade.findUnique({ where: { id } });
    if (!atual) return naoEncontrado(res, "Atividade nao encontrada.");

    if (!ehAdmin(req.usuario) && !ehDono(req.usuario, atual)) {
      return proibido(res);
    }

    if (atual.situacao === "Aprovada" && !ehAdmin(req.usuario)) {
      return conflito(res, "Nao e possivel excluir uma atividade ja aprovada.");
    }

    await prisma.atividade.delete({ where: { id } });
    apagarArquivoSilencioso(atual.comprovantePath);

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
});

export default router;
