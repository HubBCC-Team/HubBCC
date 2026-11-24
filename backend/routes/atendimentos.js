/* ---------------------------------------------------------------------------
   routes/atendimentos.js
   Registro e avaliacao dos atendimentos (Prisma).        Responsavel: Geovanne

   Regras de acesso
   - registrar / editar registro / desfazer : monitor da oferta ou admin.
   - avaliar                                 : o aluno do agendamento ou admin.
   - consultar : aluno (os proprios), monitor (das proprias ofertas), admin (todos).
--------------------------------------------------------------------------- */
import express from "express";

import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import {
  validar,
  idDaRota,
  proibido,
  naoEncontrado,
  conflito,
  erroInterno,
  ErroNegocio,
} from "../lib/http.js";
import {
  atendimentoCriacaoSchema,
  atendimentoAtualizacaoSchema,
  atendimentoFiltrosSchema,
} from "../schemas/atendimentoSchema.js";

const router = express.Router();

const INCLUIR = { agendamento: true };

/* ------------------------------- AUXILIARES ------------------------------ */

function formatarAtendimento(atendimento) {
  const { agendamento } = atendimento;

  return {
    id: atendimento.id,
    agendamentoId: atendimento.agendamentoId,
    usuarioId: agendamento.usuarioId,
    ofertaId: agendamento.ofertaId,
    titulo: agendamento.titulo,
    disciplina: agendamento.disciplina,
    monitor: agendamento.monitor,
    data: agendamento.data.toISOString().slice(0, 10),
    hora: agendamento.hora,
    registro: atendimento.registro,
    avaliacao: atendimento.avaliacao,
  };
}

const ehAdmin = (usuario) => usuario.perfil === "admin";
const ehAlunoDoAgendamento = (usuario, ag) => ag.usuarioId === usuario.id;
const ehMonitorDaOferta = (usuario, ag) =>
  ag.monitorId !== null && ag.monitorId === usuario.id;

const podeVer = (usuario, ag) =>
  ehAdmin(usuario) || ehAlunoDoAgendamento(usuario, ag) || ehMonitorDaOferta(usuario, ag);

const podeRegistrar = (usuario, ag) =>
  ehAdmin(usuario) || ehMonitorDaOferta(usuario, ag);

const podeAvaliar = (usuario, ag) =>
  ehAdmin(usuario) || ehAlunoDoAgendamento(usuario, ag);

function responderErro(res, erro) {
  if (erro instanceof ErroNegocio) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }
  return erroInterno(res, erro);
}

/* ---------------------------------- READ --------------------------------- */

// GET /atendimentos?agendamentoId=&usuarioId=
router.get("/", autenticar, async (req, res) => {
  const filtros = validar(atendimentoFiltrosSchema, req.query, res);
  if (!filtros) return;

  const eu = req.usuario;
  const agendamento = {};

  if (eu.perfil === "aluno") {
    agendamento.usuarioId = eu.id;
  } else if (eu.perfil === "monitor") {
    if (filtros.usuarioId === eu.id) {
      agendamento.usuarioId = eu.id;
    } else {
      agendamento.monitorId = eu.id;
      if (filtros.usuarioId) agendamento.usuarioId = filtros.usuarioId;
    }
  } else if (ehAdmin(eu)) {
    if (filtros.usuarioId) agendamento.usuarioId = filtros.usuarioId;
  } else {
    return proibido(res);
  }

  const where = { agendamento };
  if (filtros.agendamentoId) where.agendamentoId = filtros.agendamentoId;

  try {
    const lista = await prisma.atendimento.findMany({
      where,
      include: INCLUIR,
      orderBy: { id: "asc" },
    });

    res.json(lista.map(formatarAtendimento));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /atendimentos/:id
router.get("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id },
      include: INCLUIR,
    });

    if (!atendimento) {
      return naoEncontrado(res, "Atendimento nao encontrado.");
    }

    if (!podeVer(req.usuario, atendimento.agendamento)) {
      return proibido(res);
    }

    res.json(formatarAtendimento(atendimento));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

/* --------------------------------- CREATE -------------------------------- */

// POST /atendimentos  { agendamentoId, registro: { compareceu, duracao, observacoes } }
// O agendamento precisa estar "Confirmado"; ele passa a "Realizado".
router.post("/", autenticar, async (req, res) => {
  const dados = validar(atendimentoCriacaoSchema, req.body, res);
  if (!dados) return;

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: dados.agendamentoId },
    });

    if (!agendamento) {
      return naoEncontrado(res, "Agendamento nao encontrado.");
    }

    if (!podeRegistrar(req.usuario, agendamento)) {
      return proibido(res, "Somente o monitor da oferta pode registrar o atendimento.");
    }

    const criado = await prisma.$transaction(async (tx) => {
      // So muda de "Confirmado" para "Realizado" uma vez, mesmo com requisicoes simultaneas.
      const alterados = await tx.agendamento.updateMany({
        where: { id: agendamento.id, situacao: "Confirmado" },
        data: { situacao: "Realizado" },
      });

      if (alterados.count === 0) {
        throw new ErroNegocio(
          409,
          "So e possivel registrar atendimento de um agendamento confirmado.",
        );
      }

      return tx.atendimento.create({
        data: {
          agendamentoId: agendamento.id,
          registro: { ...dados.registro, registradoEm: new Date().toISOString() },
        },
        include: INCLUIR,
      });
    });

    res.status(201).json(formatarAtendimento(criado));
  } catch (erro) {
    responderErro(res, erro);
  }
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /atendimentos/:id  { registro?, avaliacao? }
router.put("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id },
      include: INCLUIR,
    });

    if (!atendimento) {
      return naoEncontrado(res, "Atendimento nao encontrado.");
    }

    const eu = req.usuario;
    const agendamento = atendimento.agendamento;

    if (!podeVer(eu, agendamento)) {
      return proibido(res);
    }

    const dados = validar(atendimentoAtualizacaoSchema, req.body, res);
    if (!dados) return;

    if (dados.registro && !podeRegistrar(eu, agendamento)) {
      return proibido(res, "Somente o monitor da oferta pode editar o registro.");
    }
    if (dados.avaliacao && !podeAvaliar(eu, agendamento)) {
      return proibido(res, "Somente o aluno do atendimento pode avalia-lo.");
    }

    const data = {};
    if (dados.registro) {
      data.registro = {
        ...dados.registro,
        registradoEm:
          atendimento.registro?.registradoEm ?? new Date().toISOString(),
      };
    }
    if (dados.avaliacao) data.avaliacao = dados.avaliacao;

    const atualizado = await prisma.atendimento.update({
      where: { id },
      data,
      include: INCLUIR,
    });

    res.json(formatarAtendimento(atualizado));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /atendimentos/:id  -> desfaz o registro (agendamento volta a "Confirmado")
router.delete("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id },
      include: INCLUIR,
    });

    if (!atendimento) {
      return naoEncontrado(res, "Atendimento nao encontrado.");
    }

    if (!podeRegistrar(req.usuario, atendimento.agendamento)) {
      return proibido(res);
    }

    await prisma.$transaction([
      prisma.atendimento.delete({ where: { id } }),
      prisma.agendamento.update({
        where: { id: atendimento.agendamentoId },
        data: { situacao: "Confirmado" },
      }),
    ]);

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
});

export default router;
