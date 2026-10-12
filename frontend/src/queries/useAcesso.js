/* ---------------------------------------------------------------------------
   queries/useAcesso.js
   TANSTACK QUERY (useMutation) para acesso e conta do usuario.

     useEntrar()          mutateAsync({ email, senha })
     useCadastrar()       mutateAsync(dados)
     useRecuperarSenha()  mutate(email)
     useRedefinirSenha()  mutate(senha)
     useAtualizarPerfil() mutate(dados)   -> grava no db.json e atualiza o AuthContext
     useResetarDados()    mutate()        -> restaura o db.json e limpa o cache
--------------------------------------------------------------------------- */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/useAuth";
import * as servico from "../service/authService";

export function useEntrar() {
  const { entrar } = useAuth();
  return useMutation({ mutationFn: ({ email, senha }) => entrar(email, senha) });
}

export function useCadastrar() {
  const { cadastrar } = useAuth();
  return useMutation({ mutationFn: (dados) => cadastrar(dados) });
}

export function useRecuperarSenha() {
  return useMutation({ mutationFn: (email) => servico.recuperarSenha(email) });
}

export function useRedefinirSenha() {
  return useMutation({ mutationFn: (senha) => servico.redefinirSenha(senha) });
}

export function useAtualizarPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  return useMutation({
    mutationFn: (dados) => servico.atualizarPerfil(usuario.id, dados),
    // O servidor confirmou: atualiza o usuario em memoria e no localStorage.
    onSuccess: (atualizado) => atualizarUsuario(atualizado),
  });
}

export function useResetarDados() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servico.resetarDadosDeTeste,
    // Todos os dados mudaram: busca tudo de novo.
    onSuccess: () => qc.invalidateQueries(),
  });
}
