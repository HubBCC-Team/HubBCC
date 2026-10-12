/* ---------------------------------------------------------------------------
   queries/useOportunidades.js
   TANSTACK QUERY para OPORTUNIDADES e CANDIDATURAS (casos de uso 1 a 8).

   CONSULTAS (useQuery) -> devolvem { data, isLoading, isFetching, isError, error, refetch }
     useOportunidades(filtros)          lista com filtros
     useOportunidade(id)                detalhe
     useCandidaturas(usuarioId, filtros)

   ALTERACOES (useMutation) -> devolvem { mutate, mutateAsync, isPending, error }
     useCadastrarOportunidade()   mutate(dados)
     useAlterarOportunidade()     mutate({ id, dados })
     useEncerrarOportunidade()    mutate(id)
     useExcluirOportunidade()     mutate(id)
     useRealizarCandidatura()     mutate(dados)
     useAvaliarCandidatura()      mutate({ id, situacao })
     useCancelarCandidatura()     mutate(id)

   Depois de cada alteracao, as consultas afetadas sao invalidadas e o
   TanStack Query busca os dados novos sozinho (substitui o "recarregar").
--------------------------------------------------------------------------- */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as servico from "../service/oportunidadeService";
import { chaves } from "./chaves";

/* ----------------------------- CONSULTAS ------------------------------ */

export function useOportunidades(filtros = {}) {
  return useQuery({
    queryKey: chaves.oportunidades.lista(filtros),
    queryFn: () => servico.listarOportunidades(filtros),
    placeholderData: keepPreviousData, // mantem a lista anterior enquanto busca a nova
  });
}

export function useOportunidade(id) {
  return useQuery({
    queryKey: chaves.oportunidades.detalhe(id),
    queryFn: () => servico.buscarOportunidade(id),
    enabled: Boolean(id), // so busca quando existe id
  });
}

export function useCandidaturas(usuarioId, filtros = {}) {
  return useQuery({
    queryKey: chaves.candidaturas.lista(usuarioId, filtros),
    queryFn: () => servico.listarCandidaturas(usuarioId, filtros),
    enabled: Boolean(usuarioId || filtros.oportunidadeId),
    placeholderData: keepPreviousData,
  });
}

/* ---------------------- ALTERACOES: OPORTUNIDADES ---------------------- */

export function useCadastrarOportunidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dados) => servico.cadastrarOportunidade(dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.oportunidades.todas }),
  });
}

export function useAlterarOportunidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => servico.alterarOportunidade(id, dados),
    onSuccess: (atualizada, { id }) => {
      qc.setQueryData(chaves.oportunidades.detalhe(id), atualizada); // detalhe atualiza na hora
      qc.invalidateQueries({ queryKey: chaves.oportunidades.todas });
    },
  });
}

export function useEncerrarOportunidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => servico.encerrarOportunidade(id),
    onSuccess: (atualizada, id) => {
      qc.setQueryData(chaves.oportunidades.detalhe(id), atualizada);
      qc.invalidateQueries({ queryKey: chaves.oportunidades.todas });
    },
  });
}

export function useExcluirOportunidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => servico.excluirOportunidade(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: chaves.oportunidades.detalhe(id) });
      qc.invalidateQueries({ queryKey: chaves.oportunidades.todas });
      qc.invalidateQueries({ queryKey: chaves.candidaturas.todas });
    },
  });
}

/* ---------------------- ALTERACOES: CANDIDATURAS ----------------------- */

export function useRealizarCandidatura() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dados) => servico.realizarCandidatura(dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.candidaturas.todas }),
  });
}

export function useAvaliarCandidatura() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, situacao }) => servico.avaliarCandidatura(id, situacao),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.candidaturas.todas }),
  });
}

export function useCancelarCandidatura() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => servico.cancelarCandidatura(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.candidaturas.todas }),
  });
}
