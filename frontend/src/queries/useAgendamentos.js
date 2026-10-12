/* ---------------------------------------------------------------------------
   queries/useAgendamentos.js
   TANSTACK QUERY para AGENDAMENTOS.

   CONSULTAS
     useAgendamentos(usuarioId, filtros)
     useAgendamento(id)

   ALTERACOES
     useRealizarAgendamento()
     useReagendar()
     useCancelarAgendamento()
     useRegistrarAtendimento()
     useAvaliarAtendimento()

   A listagem pode ser feita pelo usuarioId ou somente por filtros,
   permitindo que o monitor consulte os atendimentos das proprias ofertas.
--------------------------------------------------------------------------- */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import * as servico from "../service/agendamentoService";
import { chaves } from "./chaves";

/* ----------------------------- CONSULTAS ------------------------------ */

export function useAgendamentos(
  usuarioId,
  filtros = {},
) {
  const possuiFiltros =
    Object.keys(filtros).length > 0;

  return useQuery({
    queryKey: chaves.agendamentos.lista(
      usuarioId,
      filtros,
    ),
    queryFn: () =>
      servico.listarAgendamentos(
        usuarioId,
        filtros,
      ),
    enabled: Boolean(usuarioId) || possuiFiltros,
    placeholderData: keepPreviousData,
  });
}

export function useAgendamento(id) {
  return useQuery({
    queryKey: chaves.agendamentos.detalhe(id),
    queryFn: () =>
      servico.buscarAgendamento(id),
    enabled: Boolean(id),
    retry: (falhas, erro) =>
      !/nao encontrado/i.test(
        erro?.message ?? "",
      ) && falhas < 1,
  });
}

/* ----------------------------- ALTERACOES ----------------------------- */

function useInvalidar() {
  const qc = useQueryClient();

  return (incluirOfertas = false) => {
    qc.invalidateQueries({
      queryKey: chaves.agendamentos.todas,
    });

    if (incluirOfertas) {
      qc.invalidateQueries({
        queryKey: chaves.ofertas.todas,
      });
    }
  };
}

export function useRealizarAgendamento() {
  const invalidar = useInvalidar();

  return useMutation({
    mutationFn: (dados) =>
      servico.realizarAgendamento(dados),
    onSuccess: () => invalidar(true),
  });
}

export function useReagendar() {
  const invalidar = useInvalidar();

  return useMutation({
    mutationFn: ({
      id,
      data,
      hora,
    }) =>
      servico.reagendar(
        id,
        data,
        hora,
      ),
    onSuccess: () => invalidar(),
  });
}

export function useCancelarAgendamento() {
  const invalidar = useInvalidar();

  return useMutation({
    mutationFn: (id) =>
      servico.cancelarAgendamento(id),
    onSuccess: () => invalidar(true),
  });
}

export function useRegistrarAtendimento() {
  const qc = useQueryClient();
  const invalidar = useInvalidar();

  return useMutation({
    mutationFn: ({
      id,
      registro,
    }) =>
      servico.registrarAtendimento(
        id,
        registro,
      ),
    onSuccess: (
      atualizado,
      { id },
    ) => {
      qc.setQueryData(
        chaves.agendamentos.detalhe(id),
        atualizado,
      );

      invalidar();
    },
  });
}

export function useAvaliarAtendimento() {
  const invalidar = useInvalidar();

  return useMutation({
    mutationFn: ({
      id,
      avaliacao,
    }) =>
      servico.avaliarAtendimento(
        id,
        avaliacao,
      ),
    onSuccess: () => invalidar(),
  });
}
