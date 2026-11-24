/* ---------------------------------------------------------------------------
   services/ofertaLookup.js
   Unico ponto em que Agendamentos/Atendimentos consultam as OFERTAS.

   Hoje as ofertas ainda estao em memoria (data/ofertas.js). Quando a Mina
   migrar as Ofertas para o Prisma, e so trocar o corpo desta funcao por
   prisma.oferta.findUnique(...), mantendo o formato devolvido:
   { id, titulo, disciplina, monitor, monitorId, modalidade, local, vagas }
--------------------------------------------------------------------------- */
import { ofertas } from "../data/ofertas.js";

export async function buscarOfertaPorId(id) {
  const oferta = ofertas.find((o) => o.id === Number(id));
  return oferta ?? null;
}

// Mantem o contador exibido em GET /ofertas coerente enquanto as ofertas
// estao em memoria. Quando migrarem para o Prisma, a Mina pode calcular
// vagasOcupadas direto com count de agendamentos "Confirmado" e apagar isto.
export function definirVagasOcupadas(id, ocupadas) {
  const oferta = ofertas.find((o) => o.id === Number(id));
  if (oferta) oferta.vagasOcupadas = ocupadas;
}
