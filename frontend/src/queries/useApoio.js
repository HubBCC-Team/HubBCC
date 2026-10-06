/* ---------------------------------------------------------------------------
   queries/useApoio.js
   TANSTACK QUERY para DISCIPLINAS e OFERTAS DE APOIO (casos de uso 9 a 13).

   CONSULTAS
     useDisciplinas()          lista para filtros e selects (quase nunca muda)
     useOfertas(filtros)       { busca, disciplinaId, tipo, modalidade, gratuita }
     useOferta(id)             detalhe

   ALTERACOES
     useCriarOferta()          mutate(dados)
     useAlterarOferta()        mutate({ id, dados })
     useCancelarOferta()       mutate(id)
--------------------------------------------------------------------------- */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as servico from "../service/apoioService";
import { chaves } from "./chaves";

/* ----------------------------- CONSULTAS ------------------------------ */

export function useDisciplinas() {
  return useQuery({
    queryKey: chaves.disciplinas.todas,
    queryFn: servico.listarDisciplinas,
    staleTime: Infinity, // tabela fixa: busca uma vez por sessao
  });
}

export function useOfertas(filtros = {}) {
  return useQuery({
    queryKey: chaves.ofertas.lista(filtros),
    queryFn: () => servico.listarOfertas(filtros),
    placeholderData: keepPreviousData, // mantem a lista anterior enquanto busca a nova
  });
}

export function useOferta(id) {
  return useQuery({
    queryKey: chaves.ofertas.detalhe(id),
    queryFn: () => servico.buscarOferta(id),
    enabled: Boolean(id),
  });
}

/* ----------------------------- ALTERACOES ----------------------------- */

export function useCriarOferta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dados) => servico.criarOferta(dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.ofertas.todas }),
  });
}

export function useAlterarOferta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => servico.alterarOferta(id, dados),
    onSuccess: (atualizada, { id }) => {
      qc.setQueryData(chaves.ofertas.detalhe(id), atualizada); // detalhe atualiza na hora
      qc.invalidateQueries({ queryKey: chaves.ofertas.todas });
    },
  });
}

export function useCancelarOferta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => servico.cancelarOferta(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: chaves.ofertas.detalhe(id) });
      qc.invalidateQueries({ queryKey: chaves.ofertas.todas });
    },
  });
}
