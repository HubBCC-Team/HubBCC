/* ---------------------------------------------------------------------------
   queries/useAtividades.js
   TANSTACK QUERY para ATIVIDADES COMPLEMENTARES (casos de uso 19 e 20).

   CONSULTAS
     useAtividades(usuarioId, filtros)   { categoria }
     useAtividade(usuarioId, id)         uma atividade (tela de edicao)
     useResumoHoras(usuarioId)           { horasAprovadas, meta, percentual, porCategoria }

   ALTERACOES
     useRegistrarAtividade()   mutate(dados)
     useAlterarAtividade()     mutate({ id, dados })
     useExcluirAtividade()     mutate(id)

   A chave do resumo tambem comeca com ["atividades"]: invalidar
   "atividades.todas" atualiza a lista E as barras de progresso.
--------------------------------------------------------------------------- */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as servico from "../service/atividadeService";
import { chaves } from "./chaves";

/* ----------------------------- CONSULTAS ------------------------------ */

export function useAtividades(usuarioId, filtros = {}) {
  return useQuery({
    queryKey: chaves.atividades.lista(usuarioId, filtros),
    queryFn: () => servico.listarAtividades(usuarioId, filtros),
    enabled: Boolean(usuarioId),
    placeholderData: keepPreviousData,
  });
}

// Reaproveita a lista completa do usuario (normalmente ja em cache)
// e seleciona o item pelo id.
export function useAtividade(usuarioId, id) {
  return useQuery({
    queryKey: chaves.atividades.lista(usuarioId, {}),
    queryFn: () => servico.listarAtividades(usuarioId, {}),
    enabled: Boolean(usuarioId && id),
    select: (lista) => lista.find((a) => String(a.id) === String(id)) ?? null,
  });
}

export function useResumoHoras(usuarioId) {
  return useQuery({
    queryKey: chaves.atividades.resumo(usuarioId),
    queryFn: () => servico.resumoHoras(usuarioId),
    enabled: Boolean(usuarioId),
  });
}

/* ----------------------------- ALTERACOES ----------------------------- */

function useMutacaoAtividade(mutationFn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.atividades.todas }),
  });
}

export function useRegistrarAtividade() {
  return useMutacaoAtividade((dados) => servico.registrarAtividade(dados));
}

export function useAlterarAtividade() {
  return useMutacaoAtividade(({ id, dados }) => servico.alterarAtividade(id, dados));
}

export function useExcluirAtividade() {
  return useMutacaoAtividade((id) => servico.excluirAtividade(id));
}
