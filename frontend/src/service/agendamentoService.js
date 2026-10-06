/* ---------------------------------------------------------------------------
   service/agendamentoService.js
   Casos de uso 14 a 18: agendar, consultar, reagendar, cancelar, registrar
   atendimento e avaliar. Uma funcao por caso de uso; as telas nunca chamam
   o axios direto (elas usam os hooks de src/queries, que chamam estas funcoes).

   NOVO: buscarAgendamento(id) -> GET /agendamentos/:id
   Usado no RegistrarAtendimento: quem registra e o MONITOR, mas o agendamento
   pertence ao ALUNO, entao nao da para procurar na lista do usuario logado.
--------------------------------------------------------------------------- */
import api from "../api/axios";

// GET /agendamentos?usuarioId=1&situacao=Confirmado
export async function listarAgendamentos(usuarioId, filtros = {}) {
  const { data } = await api.get("/agendamentos", {
    params: { usuarioId, ...filtros, _sort: "data", _order: "asc" },
  });
  return data;
}

// GET /agendamentos/:id
export async function buscarAgendamento(id) {
  const { data } = await api.get(`/agendamentos/${id}`);
  return data;
}

// POST /agendamentos  (o servidor valida vaga e conflito de horario)
export async function realizarAgendamento({ usuarioId, ofertaId, data: dia, hora }) {
  const { data } = await api.post("/agendamentos", { usuarioId, ofertaId, data: dia, hora });
  return data;
}

// PUT /agendamentos/:id  (data e hora novas)
export async function reagendar(id, novaData, novaHora) {
  const { data } = await api.put(`/agendamentos/${id}`, { data: novaData, hora: novaHora });
  return data;
}

// DELETE /agendamentos/:id  (cancelamento logico + devolve a vaga)
export async function cancelarAgendamento(id) {
  await api.delete(`/agendamentos/${id}`);
}

// PUT /agendamentos/:id  { situacao: "Realizado", registro }
export async function registrarAtendimento(id, registro) {
  const { data } = await api.put(`/agendamentos/${id}`, {
    situacao: "Realizado",
    registro: { ...registro, registradoEm: new Date().toISOString() },
  });
  return data;
}

// PUT /agendamentos/:id  { avaliacao }
export async function avaliarAtendimento(id, avaliacao) {
  const { data } = await api.put(`/agendamentos/${id}`, { avaliacao });
  return data;
}
