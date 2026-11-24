/* ---------------------------------------------------------------------------
   routes/agendamentos.js
   Agendamentos de monitoria/tutoria (Prisma).            Responsavel: Geovanne

   Regras de acesso
   - aluno   : so enxerga e altera os PROPRIOS agendamentos.
   - monitor : enxerga os agendamentos das proprias ofertas (e os dele como aluno).
   - admin   : acesso total.
   Todas as rotas exigem login (401) e respeitam ownership (403).

   Idempotencia: POST /agendamentos aceita o header "Idempotency-Key". Repetir
   a mesma chave devolve o agendamento ja criado (200) em vez de criar outro.
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
  agendamentoCriacaoSchema,
  agendamentoReagendarSchema,
  agendamentoFiltrosSchema,
  idempotencyKeySchema,
} from "../schemas/agendamentoSchema.js";
import {
  buscarOfertaPorId,
  definirVagasOcupadas,
} from "../services/ofertaLookup.js";

const router = express.Router();

const INCLUIR = { atendimento: true };

/* ------------------------------- AUXILIARES ------------------------------ */

// Formato que o frontend ja consome (registro/avaliacao dentro do agendamento).
export function formatarAgendamento(agendamento) {
  const { atendimento, idempotencyKey, criadoEm, data, ...dados } = agendamento;

  return {
    ...dados,
    data: data.toISOString().slice(0, 10),
    registro: atendimento?.registro ?? null,
    avaliacao: atendimento?.avaliacao ?? null,
    atendimentoId: atendimento?.id ?? null,
  };
}

const diaParaDate = (data) => new Date(`${data}T00:00:00Z`);

const ehAdmin = (usuario) => usuario.perfil === "admin";
const ehDono = (usuario, agendamento) => agendamento.usuarioId === usuario.id;
const ehMonitorDaOferta = (usuario, agendamento) =>
  agendamento.monitorId !== null && agendamento.monitorId === usuario.id;

// Serializa operacoes concorrentes na mesma oferta / mesmo aluno
// (lock de transacao do Postgres, liberado no commit/rollback).
async function travar(tx, { ofertaId, usuarioId }) {
  if (ofertaId) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(1, ${ofertaId}::int)`;
  }
  if (usuarioId) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(2, ${usuarioId}::int)`;
  }
}

async function atualizarVagas(ofertaId) {
  const ocupadas = await prisma.agendamento.count({
    where: { ofertaId, situacao: { not: "Cancelado" } },
  });
  definirVagasOcupadas(ofertaId, ocupadas);
}

function responderErro(res, erro) {
  if (erro instanceof ErroNegocio) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }
  return erroInterno(res, erro);
}

/* ---------------------------------- READ --------------------------------- */

// GET /agendamentos?usuarioId=&situacao=&monitor=&ofertaId=&_order=asc|desc
router.get("/", autenticar, async (req, res) => {
  const filtros = validar(agendamentoFiltrosSchema, req.query, res);
  if (!filtros) return;

  const { usuarioId, ofertaId, situacao, monitor, _order } = filtros;
  const eu = req.usuario;
  const where = {};

  if (eu.perfil === "aluno") {
    // Ignora qualquer usuarioId da URL: o aluno so ve os proprios.
    where.usuarioId = eu.id;
  } else if (eu.perfil === "monitor") {
    if (usuarioId === eu.id) {
      where.usuarioId = eu.id; // agendamentos dele como aluno
    } else {
      where.monitorId = eu.id; // atendimentos das ofertas dele
      if (usuarioId) where.usuarioId = usuarioId;
    }
  } else if (ehAdmin(eu)) {
    if (usuarioId) where.usuarioId = usuarioId;
    if (monitor) where.monitor = monitor;
  } else {
    return proibido(res);
  }

  if (ofertaId) where.ofertaId = ofertaId;
  if (situacao) where.situacao = situacao;

  try {
    const lista = await prisma.agendamento.findMany({
      where,
      include: INCLUIR,
      orderBy: [{ data: _order }, { hora: _order }, { id: "asc" }],
    });

    res.json(lista.map(formatarAgendamento));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

// GET /agendamentos/:id
router.get("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: INCLUIR,
    });

    if (!agendamento) {
      return naoEncontrado(res, "Agendamento nao encontrado.");
    }

    const eu = req.usuario;
    if (!ehAdmin(eu) && !ehDono(eu, agendamento) && !ehMonitorDaOferta(eu, agendamento)) {
      return proibido(res);
    }

    res.json(formatarAgendamento(agendamento));
  } catch (erro) {
    erroInterno(res, erro);
  }
});

/* --------------------------------- CREATE -------------------------------- */

// POST /agendamentos  { ofertaId, data, hora }   (+ header Idempotency-Key)
router.post("/", autenticar, async (req, res) => {
  const dados = validar(agendamentoCriacaoSchema, req.body, res);
  if (!dados) return;

  const eu = req.usuario;

  let chave = null;
  const cabecalho = req.get("Idempotency-Key");
  if (cabecalho !== undefined) {
    const resultado = idempotencyKeySchema.safeParse(cabecalho);
    if (!resultado.success) {
      return res.status(400).json({ mensagem: resultado.error.issues[0].message });
    }
    chave = resultado.data;
  }

  // Quem agenda e o dono do token. So o admin agenda em nome de outra pessoa.
  let usuarioId = eu.id;
  if (dados.usuarioId && dados.usuarioId !== eu.id) {
    if (!ehAdmin(eu)) {
      return proibido(res, "Voce so pode agendar para voce mesmo.");
    }
    usuarioId = dados.usuarioId;
  }

  const diaDate = diaParaDate(dados.data);

  // Resposta para uma requisicao repetida (mesma chave).
  const responderRepetida = (existente) => {
    const mesmosDados =
      existente.ofertaId === dados.ofertaId &&
      existente.hora === dados.hora &&
      existente.data.getTime() === diaDate.getTime();

    if (!mesmosDados) {
      return res.status(422).json({
        mensagem: "Idempotency-Key ja foi usada com outros dados.",
      });
    }

    res.set("Idempotency-Replayed", "true");
    return res.status(200).json(formatarAgendamento(existente));
  };

  try {
    if (chave) {
      const existente = await prisma.agendamento.findUnique({
        where: { usuarioId_idempotencyKey: { usuarioId, idempotencyKey: chave } },
        include: INCLUIR,
      });
      if (existente) return responderRepetida(existente);
    }

    if (usuarioId !== eu.id) {
      const alvo = await prisma.usuario.findUnique({ where: { id: usuarioId } });
      if (!alvo) return naoEncontrado(res, "Usuario nao encontrado.");
    }

    const oferta = await buscarOfertaPorId(dados.ofertaId);
    if (!oferta) return naoEncontrado(res, "Oferta de apoio nao encontrada.");

    const resultado = await prisma.$transaction(async (tx) => {
      await travar(tx, { ofertaId: oferta.id, usuarioId });

      // Com o lock, uma requisicao simultanea com a mesma chave chega aqui
      // depois da primeira: reconhece a chave antes de olhar vagas/conflitos.
      if (chave) {
        const jaCriado = await tx.agendamento.findUnique({
          where: { usuarioId_idempotencyKey: { usuarioId, idempotencyKey: chave } },
          include: INCLUIR,
        });
        if (jaCriado) return { agendamento: jaCriado, repetida: true };
      }

      const ocupadas = await tx.agendamento.count({
        where: { ofertaId: oferta.id, situacao: { not: "Cancelado" } },
      });
      if (ocupadas >= oferta.vagas) {
        throw new ErroNegocio(409, "Nao ha vagas nesta oferta.");
      }

      const choque = await tx.agendamento.findFirst({
        where: { usuarioId, data: diaDate, hora: dados.hora, situacao: "Confirmado" },
      });
      if (choque) {
        throw new ErroNegocio(409, "Voce ja tem um agendamento nesse dia e horario.");
      }

      const novo = await tx.agendamento.create({
        data: {
          usuarioId,
          ofertaId: oferta.id,
          monitorId: oferta.monitorId ?? null,
          titulo: oferta.titulo,
          disciplina: oferta.disciplina,
          monitor: oferta.monitor,
          modalidade: oferta.modalidade,
          local: oferta.local,
          data: diaDate,
          hora: dados.hora,
          idempotencyKey: chave,
        },
        include: INCLUIR,
      });

      return { agendamento: novo, repetida: false };
    });

    if (resultado.repetida) return responderRepetida(resultado.agendamento);

    await atualizarVagas(oferta.id);

    res.status(201).json(formatarAgendamento(resultado.agendamento));
  } catch (erro) {
    // Duas requisicoes simultaneas com a mesma chave: a constraint unica do
    // banco barra a segunda, e devolvemos o registro da primeira.
    if (erro?.code === "P2002" && chave) {
      const existente = await prisma.agendamento.findUnique({
        where: { usuarioId_idempotencyKey: { usuarioId, idempotencyKey: chave } },
        include: INCLUIR,
      });
      if (existente) return responderRepetida(existente);
    }
    responderErro(res, erro);
  }
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /agendamentos/:id  { data, hora }  -> reagendar
router.put("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      return naoEncontrado(res, "Agendamento nao encontrado.");
    }

    const eu = req.usuario;
    if (!ehAdmin(eu) && !ehDono(eu, agendamento)) {
      return proibido(res);
    }

    const dados = validar(agendamentoReagendarSchema, req.body, res);
    if (!dados) return;

    const diaDate = diaParaDate(dados.data);

    const atualizado = await prisma.$transaction(async (tx) => {
      await travar(tx, { usuarioId: agendamento.usuarioId });

      // Rele dentro do lock para nao decidir com a situacao desatualizada.
      const atual = await tx.agendamento.findUnique({ where: { id } });
      if (!atual || atual.situacao !== "Confirmado") {
        throw new ErroNegocio(
          409,
          "So e possivel reagendar um agendamento confirmado.",
        );
      }

      const choque = await tx.agendamento.findFirst({
        where: {
          usuarioId: atual.usuarioId,
          data: diaDate,
          hora: dados.hora,
          situacao: "Confirmado",
          id: { not: id },
        },
      });
      if (choque) {
        throw new ErroNegocio(409, "Voce ja tem um agendamento nesse dia e horario.");
      }

      return tx.agendamento.update({
        where: { id },
        data: { data: diaDate, hora: dados.hora },
        include: INCLUIR,
      });
    });

    res.json(formatarAgendamento(atualizado));
  } catch (erro) {
    responderErro(res, erro);
  }
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /agendamentos/:id  -> cancela (situacao "Cancelado") e libera a vaga
router.delete("/:id", autenticar, async (req, res) => {
  const id = idDaRota(req, res);
  if (!id) return;

  try {
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      return naoEncontrado(res, "Agendamento nao encontrado.");
    }

    const eu = req.usuario;
    if (!ehAdmin(eu) && !ehDono(eu, agendamento)) {
      return proibido(res);
    }

    if (agendamento.situacao === "Realizado") {
      return conflito(res, "Nao e possivel cancelar um atendimento ja realizado.");
    }

    if (agendamento.situacao !== "Cancelado") {
      // updateMany com a situacao no filtro evita cancelar duas vezes
      // se duas requisicoes chegarem juntas.
      await prisma.agendamento.updateMany({
        where: { id, situacao: "Confirmado" },
        data: { situacao: "Cancelado" },
      });
      await atualizarVagas(agendamento.ofertaId);
    }

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
});

export default router;
