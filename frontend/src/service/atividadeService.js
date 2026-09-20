/* ---------------------------------------------------------------------------
   service/atividadeService.js
   Casos de uso 19 e 20: atividades complementares e horas.
--------------------------------------------------------------------------- */
import api from "../api/axios";

// Lista as atividades do usuario (caso de uso 20).
export async function listarAtividades(usuarioId, filtros = {}) {
  const { data } = await api.get("/atividades", { params: { usuarioId, ...filtros } });
  return data;
}

// Resumo de horas: { horasAprovadas, meta, percentual, porCategoria, totalAtividades }.
// Usado no dashboard e na tela de Atividades & Horas.
export async function resumoHoras(usuarioId) {
  const { data } = await api.get("/atividades/resumo", { params: { usuarioId } });
  return data;
}

// Registra uma nova atividade complementar (caso de uso 19).
export async function registrarAtividade(dados) {
  const { data } = await api.post("/atividades", dados);
  return data;
}

// Altera uma atividade ja registrada.
export async function alterarAtividade(id, dados) {
  const { data } = await api.put(`/atividades/${id}`, dados);
  return data;
}

// Exclui uma atividade.
export async function excluirAtividade(id) {
  await api.delete(`/atividades/${id}`);
}
