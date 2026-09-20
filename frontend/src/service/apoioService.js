/* ---------------------------------------------------------------------------
   service/apoioService.js
   Casos de uso 9 a 13: ofertas de apoio academico (monitorias e tutorias).
--------------------------------------------------------------------------- */
import api from "../api/axios";

// Lista de disciplinas — usada nos filtros e nos selects dos formularios.
export async function listarDisciplinas() {
  const { data } = await api.get("/disciplinas");
  return data;
}

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
