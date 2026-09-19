// Cliente falso para o front funcionar isolado, sem backend.
// Mesma assinatura que o AuthContext espera (login/register), então trocar
// por chamadas reais de API depois é só trocar este arquivo.
import { listarUsuarios, salvarUsuarios } from "./mockDb";
import { PERFIS_CADASTRAVEIS } from "../utils/perfis";

const atraso = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function gerarToken(usuario) {
  return btoa(`${usuario.id}:${usuario.email}:${Date.now()}`);
}

export async function login(_url, dados) {
  await atraso(400);
  const usuarios = listarUsuarios();
  const encontrado = usuarios.find(
    (u) => u.email === dados.email && u.senha === dados.senha
  );

  if (!encontrado) {
    const erro = new Error("Credenciais inválidas");
    erro.response = { status: 401, data: { error: "E-mail ou senha incorretos." } };
    throw erro;
  }

  const { senha, ...usuarioSemSenha } = encontrado;
  return { token: gerarToken(encontrado), user: usuarioSemSenha };
}

export async function register(_url, dados) {
  await atraso(400);
  const usuarios = listarUsuarios();

  if (!PERFIS_CADASTRAVEIS.includes(dados.profileType)) {
    const erro = new Error("Perfil inválido");
    erro.response = { status: 400, data: { error: "Perfil inválido para autocadastro." } };
    throw erro;
  }

  if (usuarios.some((u) => u.email === dados.email)) {
    const erro = new Error("E-mail já cadastrado");
    erro.response = { status: 409, data: { error: "Este e-mail já está cadastrado." } };
    throw erro;
  }

  const novo = {
    id: usuarios.length + 1,
    firstName: dados.firstName,
    lastName: dados.lastName,
    email: dados.email,
    matricula: dados.matricula,
    profileType: dados.profileType,
    senha: dados.password,
  };

  salvarUsuarios([...usuarios, novo]);
  return { message: "Cadastro realizado com sucesso." };
}

const api = {
  defaults: {
    headers: {
      common: {},
    },
  },
};

export default api;
