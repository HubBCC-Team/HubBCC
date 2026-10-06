/* ---------------------------------------------------------------------------
   queries/chaves.js
   CHAVES DO CACHE DO TANSTACK QUERY (query keys).

   Cada consulta fica guardada no cache com uma "chave" (um array).
   Invalidar ["ofertas"] atualiza TODAS as consultas que comecam com
   "ofertas" (listas com qualquer filtro e detalhes).
--------------------------------------------------------------------------- */
export const chaves = {
  disciplinas: {
    todas: ["disciplinas"],
  },
  oportunidades: {
    todas: ["oportunidades"],
    lista: (filtros = {}) => ["oportunidades", "lista", filtros],
    detalhe: (id) => ["oportunidades", "detalhe", String(id)],
  },
  candidaturas: {
    todas: ["candidaturas"],
    lista: (usuarioId, filtros = {}) => ["candidaturas", "lista", String(usuarioId), filtros],
  },
  ofertas: {
    todas: ["ofertas"],
    lista: (filtros = {}) => ["ofertas", "lista", filtros],
    detalhe: (id) => ["ofertas", "detalhe", String(id)],
  },
  agendamentos: {
    todas: ["agendamentos"],
    lista: (usuarioId, filtros = {}) => ["agendamentos", "lista", String(usuarioId), filtros],
    detalhe: (id) => ["agendamentos", "detalhe", String(id)],
  },
  atividades: {
    todas: ["atividades"],
    lista: (usuarioId, filtros = {}) => ["atividades", "lista", String(usuarioId), filtros],
    resumo: (usuarioId) => ["atividades", "resumo", String(usuarioId)],
  },
};
