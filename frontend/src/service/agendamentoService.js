/* ---------------------------------------------------------------------------
   service/agendamentoService.js
   Casos de uso 14 a 18: agendamentos, reagendamento, registro e avaliacao.
--------------------------------------------------------------------------- */
import api from "../api/axios";

// Lista os agendamentos do usuario (caso de uso 15).
export async function listarAgendamentos(usuarioId, filtros = {}) {
  const { data } = await api.get("/agendamentos", { params: { usuarioId, ...filtros } });
  return data;
}

// Realiza um agendamento (caso de uso 14 — prioridade 1 do projeto).
// dados = { usuarioId, ofertaId, data: "2026-09-22", hora: "14:00" }
export async function realizarAgendamento(dados) {
  const { data } = await api.post("/agendamentos", dados);
  return data;
}

// Reagenda: troca apenas data e hora (caso de uso 16).
export async function reagendar(id, novaData, novaHora) {
  const { data } = await api.put(`/agendamentos/${id}`, { data: novaData, hora: novaHora });
  return data;
}

// Cancela o agendamento e devolve a vaga para a oferta (caso de uso 16).
export async function cancelarAgendamento(id) {
  await api.delete(`/agendamentos/${id}`);
}

// Registra a realizacao do atendimento (caso de uso 17).
// registro = { compareceu: true, duracao: 120, observacoes: "..." }
export async function registrarAtendimento(id, registro) {
  const { data } = await api.put(`/agendamentos/${id}`, { situacao: "Realizado", registro });
  return data;
}

// Avalia o atendimento (caso de uso 18).
// avaliacao = { nota: 5, comentario: "...", tags: ["Didatico"] }
export async function avaliarAtendimento(id, avaliacao) {
  const { data } = await api.put(`/agendamentos/${id}`, { avaliacao });
  return data;
}
