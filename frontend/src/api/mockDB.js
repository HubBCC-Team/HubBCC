// Base de dados falsa em memória — só para o front funcionar sem backend.
// Ao conectar com a API de verdade, este arquivo (e o axios.js) é descartado.
import { PERFIS } from "../utils/perfis";

export const usuariosSeed = [
  {
    id: 1,
    firstName: "Mina",
    lastName: "Monteiro",
    email: "mina.monteiro@aluno.hubbcc.edu.br",
    matricula: "2023.1.08.045",
    profileType: PERFIS.ALUNO,
    senha: "123456",
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "Ribeiro",
    email: "ana.ribeiro@monitor.hubbcc.edu.br",
    matricula: "2021.1.02.010",
    profileType: PERFIS.MONITOR,
    senha: "123456",
  },
  {
    id: 3,
    firstName: "Admin",
    lastName: "HubBCC",
    email: "admin@hubbcc.edu.br",
    matricula: "-",
    profileType: PERFIS.ADMINISTRADOR,
    senha: "123456",
  },
];

function carregar() {
  const salvo = localStorage.getItem("hubbcc_mock_usuarios");
  if (salvo) return JSON.parse(salvo);
  localStorage.setItem("hubbcc_mock_usuarios", JSON.stringify(usuariosSeed));
  return usuariosSeed;
}

export function listarUsuarios() {
  return carregar();
}

export function salvarUsuarios(usuarios) {
  localStorage.setItem("hubbcc_mock_usuarios", JSON.stringify(usuarios));
}
