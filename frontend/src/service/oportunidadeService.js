/* ---------------------------------------------------------------------------
   service/oportunidadeService.js
   Casos de uso 1 a 8: oportunidades academicas e candidaturas.
--------------------------------------------------------------------------- */
import api from "../api/axios";

/* ---------------------------- OPORTUNIDADES ---------------------------- */

// Lista oportunidades. "filtros" e um objeto simples, ex.:
// { busca: "calculo", tipo: "Monitoria", modalidade: "Remoto", situacao: "Aberta" }
export async function listarOportunidades(filtros = {}) {
  const { data } = await api.get("/oportunidades", { params: filtros });
  return data;
}

// Busca uma oportunidade especifica pelo id.
export async function buscarOportunidade(id) {
  const { data } = await api.get(`/oportunidades/${id}`);
  return data;
}

// Cadastra uma nova oportunidade (caso de uso 1).
export async function cadastrarOportunidade(dados) {
  const { data } = await api.post("/oportunidades", dados);
  return data;
}

// Altera uma oportunidade existente (caso de uso 4).
export async function alterarOportunidade(id, dados) {
  const { data } = await api.put(`/oportunidades/${id}`, dados);
  return data;
}

// Encerra a oportunidade (caso de uso 5) — apenas muda a situacao.
export async function encerrarOportunidade(id) {
  const { data } = await api.put(`/oportunidades/${id}`, { situacao: "Encerrada" });
  return data;
}

// Exclui a oportunidade definitivamente.
export async function excluirOportunidade(id) {
  await api.delete(`/oportunidades/${id}`);
}

/* ----------------------------- CANDIDATURAS ---------------------------- */

// Lista as candidaturas de um usuario (caso de uso 7).
export async function listarCandidaturas(usuarioId, filtros = {}) {
  const { data } = await api.get("/candidaturas", { params: { usuarioId, ...filtros } });
  return data;
}

// Realiza uma candidatura (caso de uso 6).
export async function realizarCandidatura(dados) {
  const { data } = await api.post("/candidaturas", dados);
  return data;
}

// Avalia a candidatura: situacao = "Aprovada" ou "Reprovada" (caso de uso 8).
export async function avaliarCandidatura(id, situacao) {
  const { data } = await api.put(`/candidaturas/${id}`, { situacao });
  return data;
}

// Cancela (exclui) a candidatura do aluno.
export async function cancelarCandidatura(id) {
  await api.delete(`/candidaturas/${id}`);
}
