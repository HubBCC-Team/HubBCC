/* ---------------------------------------------------------------------------
   service/apoioService.js
   Casos de uso 9 a 13: ofertas de apoio academico (monitorias e tutorias).
   Tambem contem o CRUD de disciplinas utilizado pelo administrador.
--------------------------------------------------------------------------- */
import api from "../api/axios";

/* ----------------------------- DISCIPLINAS ----------------------------- */

// Lista todas as disciplinas.
export async function listarDisciplinas() {
  const { data } = await api.get("/disciplinas");
  return data;
}

// Cadastra uma nova disciplina.
export async function cadastrarDisciplina(dados) {
  const { data } = await api.post("/disciplinas", dados);
  return data;
}

// Altera uma disciplina existente.
export async function alterarDisciplina(id, dados) {
  const { data } = await api.put(`/disciplinas/${id}`, dados);
  return data;
}

// Exclui uma disciplina.
export async function excluirDisciplina(id) {
  await api.delete(`/disciplinas/${id}`);
}

/* -------------------------- OFERTAS DE APOIO --------------------------- */

// Lista ofertas de apoio. Filtros possiveis:
// { busca, disciplinaId, tipo, modalidade, gratuita }
export async function listarOfertas(filtros = {}) {
  const { data } = await api.get("/ofertas", { params: filtros });
  return data;
}

// Detalhe de uma oferta.
export async function buscarOferta(id) {
  const { data } = await api.get(`/ofertas/${id}`);
  return data;
}

// Cria uma oferta de apoio (caso de uso 9).
export async function criarOferta(dados) {
  const { data } = await api.post("/ofertas", dados);
  return data;
}

// Altera uma oferta existente (caso de uso 12).
export async function alterarOferta(id, dados) {
  const { data } = await api.put(`/ofertas/${id}`, dados);
  return data;
}

// Cancela uma oferta (caso de uso 13).
export async function cancelarOferta(id) {
  await api.delete(`/ofertas/${id}`);
}
