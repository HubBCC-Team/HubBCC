/* ---------------------------------------------------------------------------
   service/authService.js
   Autenticacao e conta do usuario.
   As rotas /auth/* e /dev/reset sao implementadas em server/server.js.
   login() e cadastrar() devolvem { token, usuario } - o AuthContext salva a sessao.
--------------------------------------------------------------------------- */
import api from "../api/axios";

// Nunca guardar a senha no front, mesmo que a API devolva.
const semSenha = ({ senha: _senha, ...resto }) => resto;

export async function login(email, senha) {
  const { data } = await api.post("/auth/login", { email: email.trim(), senha });
  return data;
}

export async function cadastrar(dados) {
  const { data } = await api.post("/auth/cadastro", dados);
  return data;
}

export async function recuperarSenha(email) {
  const { data } = await api.post("/auth/recuperar-senha", { email: email.trim() });
  return data;
}

export async function redefinirSenha(senha) {
  const { data } = await api.post("/auth/nova-senha", { senha });
  return data;
}

// PATCH /usuarios/:id - grava telefone, banner etc. no db.json
export async function atualizarPerfil(id, dados) {
  const { data } = await api.patch(`/usuarios/${id}`, dados);
  return semSenha(data);
}

// POST /dev/reset - restaura o db.json a partir de server/db.seed.json
export async function resetarDadosDeTeste() {
  const { data } = await api.post("/dev/reset");
  return data;
}
