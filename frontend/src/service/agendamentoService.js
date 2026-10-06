/* ---------------------------------------------------------------------------
   service/agendamentoService.js
   Casos de uso 14 a 18: agendar, consultar, reagendar, cancelar, registrar
   atendimento e avaliar.

   A listagem pode ser feita:
   - pelo usuarioId, para o aluno consultar seus proprios agendamentos;
   - pelos filtros, como monitor, para o monitor consultar atendimentos
     vinculados as ofertas dele.
--------------------------------------------------------------------------- */

import api from "../api/axios";

// GET /agendamentos?usuarioId=1&situacao=Confirmado
// ou GET /agendamentos?monitor=Nome&situacao=Confirmado
export async function listarAgendamentos(
  usuarioId,
  filtros = {},
) {
  const params = {
    ...filtros,
    _sort: "data",
    _order: "asc",
  };

  if (usuarioId) {
    params.usuarioId = usuarioId;
  }

  const { data } = await api.get("/agendamentos", {
    params,
  });

  return data;
}

// GET /agendamentos/:id
export async function buscarAgendamento(id) {
  const { data } = await api.get(
    `/agendamentos/${id}`,
  );

  return data;
}

// POST /agendamentos
export async function realizarAgendamento({
  usuarioId,
  ofertaId,
  data: dia,
  hora,
}) {
  const { data } = await api.post(
    "/agendamentos",
    {
      usuarioId,
      ofertaId,
      data: dia,
      hora,
    },
  );

  return data;
}

// PUT /agendamentos/:id
export async function reagendar(
  id,
  novaData,
  novaHora,
) {
  const { data } = await api.put(
    `/agendamentos/${id}`,
    {
      data: novaData,
      hora: novaHora,
    },
  );

  return data;
}

// DELETE /agendamentos/:id
export async function cancelarAgendamento(id) {
  await api.delete(`/agendamentos/${id}`);
}

// PUT /agendamentos/:id
export async function registrarAtendimento(
  id,
  registro,
) {
  const { data } = await api.put(
    `/agendamentos/${id}`,
    {
      situacao: "Realizado",
      registro: {
        ...registro,
        registradoEm: new Date().toISOString(),
      },
    },
  );

  return data;
}

// PUT /agendamentos/:id
export async function avaliarAtendimento(
  id,
  avaliacao,
) {
  const { data } = await api.put(
    `/agendamentos/${id}`,
    {
      avaliacao,
    },
  );

  return data;
}
