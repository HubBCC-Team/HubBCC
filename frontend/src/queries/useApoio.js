/* ---------------------------------------------------------------------------
   queries/useApoio.js
   TANSTACK QUERY para DISCIPLINAS e OFERTAS DE APOIO (casos de uso 9 a 13).

   CONSULTAS
     useDisciplinas()          lista de disciplinas
     useOfertas(filtros)       { busca, disciplinaId, tipo, modalidade, gratuita }
     useOferta(id)             detalhe

   ALTERACOES
     useCadastrarDisciplina()  mutate(dados)
     useAlterarDisciplina()    mutate({ id, dados })
     useExcluirDisciplina()    mutate(id)
     useCriarOferta()          mutate(dados)
     useAlterarOferta()        mutate({ id, dados })
     useCancelarOferta()       mutate(id)
--------------------------------------------------------------------------- */
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import * as servico from "../service/apoioService";
import { chaves } from "./chaves";

/* ----------------------------- CONSULTAS ------------------------------ */

export function useDisciplinas() {
  return useQuery({
    queryKey: chaves.disciplinas.todas,
    queryFn: servico.listarDisciplinas,
  });
}

export function useOfertas(filtros = {}) {
  return useQuery({
    queryKey: chaves.ofertas.lista(filtros),
    queryFn: () => servico.listarOfertas(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useOferta(id) {
  return useQuery({
    queryKey: chaves.ofertas.detalhe(id),
    queryFn: () => servico.buscarOferta(id),
    enabled: Boolean(id),
  });
}

/* --------------------------- DISCIPLINAS ------------------------------ */

export function useCadastrarDisciplina() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dados) => servico.cadastrarDisciplina(dados),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.disciplinas.todas });
    },
  });
}

export function useAlterarDisciplina() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }) =>
      servico.alterarDisciplina(id, dados),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.disciplinas.todas });
    },
  });
}

export function useExcluirDisciplina() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => servico.excluirDisciplina(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.disciplinas.todas });
      qc.invalidateQueries({ queryKey: chaves.ofertas.todas });
    },
  });
}

/* -------------------------- OFERTAS DE APOIO --------------------------- */

export function useCriarOferta() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dados) => servico.criarOferta(dados),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: chaves.ofertas.todas }),
  });
}

export function useAlterarOferta() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }) =>
      servico.alterarOferta(id, dados),
    onSuccess: (atualizada, { id }) => {
      qc.setQueryData(chaves.ofertas.detalhe(id), atualizada);
      qc.invalidateQueries({ queryKey: chaves.ofertas.todas });
    },
  });
}

export function useCancelarOferta() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => servico.cancelarOferta(id),
    onSuccess: (_, id) => {
      qc.removeQueries({
        queryKey: chaves.ofertas.detalhe(id),
      });

      qc.invalidateQueries({
        queryKey: chaves.ofertas.todas,
      });
    },
  });
}
