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
// Quem agenda e o usuario do token (o backend ignora/recusa outro usuarioId).
// "chaveIdempotencia" vai no header Idempotency-Key: se a mesma requisicao for
// repetida (duplo clique, retry de rede), o backend devolve o agendamento ja
// criado em vez de criar outro. Sem chave informada, uma nova e gerada.
export async function realizarAgendamento({
  ofertaId,
  data: dia,
  hora,
  chaveIdempotencia,
}) {
  const { data } = await api.post(
    "/agendamentos",
    {
      ofertaId,
      data: dia,
      hora,
    },
    {
      headers: {
        "Idempotency-Key":
          chaveIdempotencia ?? crypto.randomUUID(),
      },
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

// POST /atendimentos  (o agendamento passa a "Realizado")
// Devolve o agendamento atualizado, que e o que as telas/cache esperam.
export async function registrarAtendimento(
  agendamentoId,
  registro,
) {
  await api.post("/atendimentos", {
    agendamentoId,
    registro,
  });

  return buscarAgendamento(agendamentoId);
}

// PUT /atendimentos/:id
// Recebe o id do ATENDIMENTO (agendamento.atendimentoId), nao o do agendamento.
export async function avaliarAtendimento(
  atendimentoId,
  avaliacao,
) {
  const { data } = await api.put(
    `/atendimentos/${atendimentoId}`,
    {
      avaliacao,
    },
  );

  return data;
}
