import express from "express";
import { agendamentos } from "../data/agendamentos.js";
import { atendimentos } from "../data/atendimentos.js";

import { ofertas } from "../data/ofertas.js";

const router = express.Router();

const proximoId = () =>
  agendamentos.reduce((maior, a) => Math.max(maior, a.id), 0) + 1;

const acharOferta = (id) => ofertas.find((o) => o.id === Number(id));

// Conflito: o mesmo aluno ja tem um agendamento confirmado nesse dia e horario.
function temConflito(usuarioId, data, hora, ignorarId = null) {
  return agendamentos.some(
    (a) =>
      String(a.usuarioId) === String(usuarioId) &&
      a.data === data &&
      a.hora === hora &&
      a.situacao === "Confirmado" &&
      a.id !== ignorarId
  );
}

// GET /agendamentos             -> lista todos
// GET /agendamentos?usuarioId=1 -> lista os de um aluno
router.get("/", (req, res) => {
  const { usuarioId } = req.query;
  const lista = usuarioId
    ? agendamentos.filter((a) => String(a.usuarioId) === String(usuarioId))
    : agendamentos;
  res.json(lista);
});

// GET /agendamentos/:id
router.get("/:id", (req, res) => {
  const agendamento = agendamentos.find((a) => a.id === Number(req.params.id));
  if (!agendamento) {
    return res.status(404).json({ erro: "Agendamento nao encontrado." });
  }
  res.json(agendamento);
});

// POST /agendamentos  { usuarioId, ofertaId, data, hora }
router.post("/", (req, res) => {
  const { usuarioId, ofertaId, data, hora } = req.body || {};

  if (!usuarioId || !ofertaId || !data || !hora) {
    return res
      .status(400)
      .json({ erro: "Informe usuarioId, ofertaId, data e hora." });
  }

  const oferta = acharOferta(ofertaId);
  if (!oferta) {
    return res.status(404).json({ erro: "Oferta de apoio nao encontrada." });
  }

  if (oferta.vagasOcupadas >= oferta.vagas) {
    return res.status(409).json({ erro: "Nao ha vagas nesta oferta." });
  }

  if (temConflito(usuarioId, data, hora)) {
    return res
      .status(409)
      .json({ erro: "Voce ja tem um agendamento nesse dia e horario." });
  }

  const novo = {
    id: proximoId(),
    usuarioId,
    ofertaId: oferta.id,
    titulo: oferta.titulo,
    disciplina: oferta.disciplina,
    monitor: oferta.monitor,
    data,
    hora,
    modalidade: oferta.modalidade,
    local: oferta.local,
    situacao: "Confirmado",
    avaliacao: null,
    registro: null,
  };

  agendamentos.push(novo);
  oferta.vagasOcupadas += 1;

  res.status(201).json(novo);
});

// PUT /agendamentos/:id  { data, hora }  -> reagendar
router.put("/:id", (req, res) => {
  const agendamento = agendamentos.find((a) => a.id === Number(req.params.id));
  if (!agendamento) {
    return res.status(404).json({ erro: "Agendamento nao encontrado." });
  }

  if (agendamento.situacao !== "Confirmado") {
    return res
      .status(409)
      .json({ erro: "So e possivel reagendar um agendamento confirmado." });
  }

  const { data, hora } = req.body || {};
  if (!data || !hora) {
    return res.status(400).json({ erro: "Informe data e hora." });
  }

  if (temConflito(agendamento.usuarioId, data, hora, agendamento.id)) {
    return res
      .status(409)
      .json({ erro: "Voce ja tem um agendamento nesse dia e horario." });
  }

  agendamento.data = data;
  agendamento.hora = hora;

  res.json(agendamento);
});

// DELETE /agendamentos/:id  -> cancelar (devolve a vaga se estava confirmado)
router.delete("/:id", (req, res) => {
  const indice = agendamentos.findIndex((a) => a.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ erro: "Agendamento nao encontrado." });
  }

  const agendamento = agendamentos[indice];

  if (agendamento.situacao === "Confirmado") {
    const oferta = acharOferta(agendamento.ofertaId);
    if (oferta && oferta.vagasOcupadas > 0) {
      oferta.vagasOcupadas -= 1;
    }
  }

  agendamentos.splice(indice, 1);

  // Apaga tambem o atendimento ligado a este agendamento (se existir).
  for (let i = atendimentos.length - 1; i >= 0; i--) {
    if (atendimentos[i].agendamentoId === agendamento.id) {
      atendimentos.splice(i, 1);
    }
  }

  res.status(204).send();
});

export default router;