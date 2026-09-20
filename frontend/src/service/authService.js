/* ---------------------------------------------------------------------------
   service/authService.js
   Funcoes de autenticacao. As telas NUNCA chamam o axios direto — elas chamam
   estas funcoes. Assim, se a rota do backend mudar, so mexemos aqui.
--------------------------------------------------------------------------- */
import api from "../api/axios";

// Faz login. Retorna { token, usuario }.
export async function login(email, senha) {
  const { data } = await api.post("/auth/login", { email, senha });
  return data;
}

// Cria uma nova conta de aluno. Retorna { token, usuario }.
export async function cadastrar(dados) {
  const { data } = await api.post("/auth/cadastro", dados);
  return data;
}

// Dispara o e-mail de recuperacao de senha.
export async function recuperarSenha(email) {
  const { data } = await api.post("/auth/recuperar-senha", { email });
  return data;
}

// Restaura o banco de testes ao estado inicial (so existe no modo mock).
export async function resetarDadosDeTeste() {
  const { data } = await api.post("/dev/reset");
  return data;
}
