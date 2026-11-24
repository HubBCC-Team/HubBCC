// Utilitarios dos testes de API (Supertest). Reutilize nos testes dos outros modulos.
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ofertas } from "../data/ofertas.js";
import { hojeISO } from "../schemas/agendamentoSchema.js";

let contador = 0;
const criados = [];

// Cria um usuario real no banco de TESTE.
export async function criarUsuario(perfil = "aluno") {
  contador += 1;
  const usuario = await prisma.usuario.create({
    data: {
      nome: `Teste ${perfil} ${contador}`,
      email: `teste-${process.pid}-${Date.now()}-${contador}@teste.local`,
      senhaHash: "hash-de-teste",
      perfil,
    },
  });
  criados.push(usuario.id);
  return usuario;
}

// Token de acesso no mesmo formato que o /auth/login emite.
export function tokenDe(usuario) {
  return jwt.sign(
    { perfil: usuario.perfil, tipo: "access" },
    process.env.JWT_SECRET,
    { subject: String(usuario.id), expiresIn: "1h" },
  );
}

export const comToken = (usuario) => ({
  Authorization: `Bearer ${tokenDe(usuario)}`,
});

// Oferta em memoria (enquanto as Ofertas nao estao no Prisma).
export function criarOferta({ monitor, vagas = 5 }) {
  const id = 9000 + ofertas.length + contador++;
  const oferta = {
    id,
    titulo: `Oferta de teste ${id}`,
    disciplina: "Disciplina de teste",
    monitorId: monitor.id,
    monitor: monitor.nome,
    modalidade: "Remoto",
    local: "Meet",
    vagas,
    vagasOcupadas: 0,
  };
  ofertas.push(oferta);
  return oferta;
}

// AAAA-MM-DD daqui a "dias" dias.
export function dataFutura(dias = 3) {
  const d = new Date(`${hojeISO()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

// Remove tudo o que o teste criou (agendamentos/atendimentos caem em cascata).
export async function limparTudo() {
  await prisma.usuario.deleteMany({ where: { id: { in: criados } } });
  criados.length = 0;
  await prisma.$disconnect();
}
