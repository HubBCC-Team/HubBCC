import express from "express";
import { atendimentos } from "../data/atendimentos.js";
import { agendamentos } from "../data/agendamentos.js";

const router = express.Router();

const proximoId = () =>
  atendimentos.reduce((maior, a) => Math.max(maior, a.id), 0) + 1;

const acharAgendamento = (id) => agendamentos.find((a) => a.id === Number(id));

const textoValido = (valor) => typeof valor === "string" && valor.trim() !== "";
const notaValida = (nota) => Number.isInteger(nota) && nota >= 1 && nota <= 5;

// GET /atendimentos                   -> lista todos
// GET /atendimentos?agendamentoId=1   -> do agendamento
// GET /atendimentos?usuarioId=1       -> de um aluno
router.get("/", (req, res) => {
  const { agendamentoId, usuarioId } = req.query;
  let lista = atendimentos;

  if (agendamentoId) {
    lista = lista.filter((a) => a.agendamentoId === Number(agendamentoId));
  }
  if (usuarioId) {
    lista = lista.filter((a) => String(a.usuarioId) === String(usuarioId));
  }

  res.json(lista);
});

// GET /atendimentos/:id
router.get("/:id", (req, res) => {
  const atendimento = atendimentos.find((a) => a.id === Number(req.params.id));
  if (!atendimento) {
    return res.status(404).json({ erro: "Atendimento nao encontrado." });
  }
  res.json(atendimento);
});

// POST /atendimentos  { agendamentoId, registro }  -> registrar atendimento
// O agendamento precisa estar "Confirmado"; ele passa a "Realizado".
router.post("/", (req, res) => {
  const { agendamentoId, registro } = req.body || {};

  if (!agendamentoId || !textoValido(registro)) {
    return res
      .status(400)
      .json({ erro: "Informe agendamentoId e registro do atendimento." });
  }

  const agendamento = acharAgendamento(agendamentoId);
  if (!agendamento) {
    return res.status(404).json({ erro: "Agendamento nao encontrado." });
  }

  if (agendamento.situacao !== "Confirmado") {
    return res.status(409).json({
      erro: "So e possivel registrar atendimento de um agendamento confirmado.",
    });
  }

  const novo = {
    id: proximoId(),
    agendamentoId: agendamento.id,
    usuarioId: agendamento.usuarioId,
    ofertaId: agendamento.ofertaId,
    titulo: agendamento.titulo,
    disciplina: agendamento.disciplina,
    monitor: agendamento.monitor,
    data: agendamento.data,
    hora: agendamento.hora,
    registro: registro.trim(),
    avaliacao: null,
  };

  atendimentos.push(novo);

  agendamento.situacao = "Realizado";
  agendamento.registro = novo.registro;

  res.status(201).json(novo);
});

// PUT /atendimentos/:id  { registro?, avaliacao? }
// Edita o texto do registro e/ou avalia o atendimento (nota de 1 a 5).
router.put("/:id", (req, res) => {
  const atendimento = atendimentos.find((a) => a.id === Number(req.params.id));
  if (!atendimento) {
    return res.status(404).json({ erro: "Atendimento nao encontrado." });
  }

  const { registro, avaliacao } = req.body || {};

  if (registro === undefined && avaliacao === undefined) {
    return res.status(400).json({ erro: "Informe registro e/ou avaliacao." });
  }

  if (registro !== undefined && !textoValido(registro)) {
    return res.status(400).json({ erro: "O registro nao pode ficar vazio." });
  }

  let nota;
  if (avaliacao !== undefined) {
    nota = Number(avaliacao);
    if (!notaValida(nota)) {
      return res.status(400).json({ erro: "A avaliacao deve ser de 1 a 5." });
    }
  }

  // Mantem o agendamento em sincronia com o atendimento.
  const agendamento = acharAgendamento(atendimento.agendamentoId);

  if (registro !== undefined) {
    atendimento.registro = registro.trim();
    if (agendamento) agendamento.registro = atendimento.registro;
  }

  if (nota !== undefined) {
    atendimento.avaliacao = nota;
    if (agendamento) agendamento.avaliacao = nota;
  }

  res.json(atendimento);
});

// DELETE /atendimentos/:id  -> desfaz o registro (agendamento volta a "Confirmado")
router.delete("/:id", (req, res) => {
  const indice = atendimentos.findIndex((a) => a.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ erro: "Atendimento nao encontrado." });
  }

  const atendimento = atendimentos[indice];

  const agendamento = acharAgendamento(atendimento.agendamentoId);
  if (agendamento && agendamento.situacao === "Realizado") {
    agendamento.situacao = "Confirmado";
    agendamento.registro = null;
    agendamento.avaliacao = null;
  }

  atendimentos.splice(indice, 1);

  res.status(204).send();
});

export default router;