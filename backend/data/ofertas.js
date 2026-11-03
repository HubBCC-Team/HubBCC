// -----------------------------------------------------------------------------
// data/ofertas.js
// Ofertas de exemplo para o DAO em memoria (DB_PROVIDER=memoria).
// Os dados somem quando o servidor reinicia.            Responsavel: Mina
// -----------------------------------------------------------------------------
export const ofertas = [
  {
    id: 1, disciplinaId: 1, disciplina: "Calculo I",
    titulo: "Monitoria de Calculo I", assunto: "Limites, derivadas e integrais",
    monitorId: 2, monitor: "Geovanne Gomes", iniciais: "GG",
    tipo: "Monitoria", modalidade: "Presencial", local: "Bloco A - Sala 210",
    gratuita: true, valor: 0, vagas: 8, vagasOcupadas: 0, nota: 4.8, totalAvaliacoes: 24,
    descricao: "Atendimento em grupo com foco em resolucao de exercicios da lista oficial.",
    horarios: [
      { id: "Segunda-14:00", dia: "Segunda", inicio: "14:00", fim: "16:00" },
      { id: "Quarta-14:00", dia: "Quarta", inicio: "14:00", fim: "16:00" },
    ],
  },
  {
    id: 2, disciplinaId: 3, disciplina: "Estrutura de Dados",
    titulo: "Tutoria de Estrutura de Dados", assunto: "Listas, pilhas, filas e arvores",
    monitorId: 3, monitor: "Marina Motta", iniciais: "MM",
    tipo: "Tutoria", modalidade: "Remoto", local: "Google Meet",
    gratuita: false, valor: 40, vagas: 4, vagasOcupadas: 0, nota: 4.9, totalAvaliacoes: 12,
    descricao: "Atendimento individual com exercicios guiados em C.",
    horarios: [
      { id: "Terca-18:00", dia: "Terca", inicio: "18:00", fim: "20:00" },
      { id: "Quinta-18:00", dia: "Quinta", inicio: "18:00", fim: "20:00" },
    ],
  },
  {
    id: 3, disciplinaId: 2, disciplina: "Algebra Linear",
    titulo: "Monitoria de Algebra Linear", assunto: "Matrizes e espacos vetoriais",
    monitorId: 2, monitor: "Geovanne Gomes", iniciais: "GG",
    tipo: "Monitoria", modalidade: "Hibrido", local: "Bloco B - Sala 105",
    gratuita: true, valor: 0, vagas: 6, vagasOcupadas: 0, nota: 4.6, totalAvaliacoes: 9,
    descricao: "Revisao de conteudo antes das provas.",
    horarios: [{ id: "Sexta-10:00", dia: "Sexta", inicio: "10:00", fim: "12:00" }],
  },
  {
    id: 4, disciplinaId: 4, disciplina: "Banco de Dados",
    titulo: "Tutoria de SQL", assunto: "Modelagem e consultas SQL",
    monitorId: 3, monitor: "Marina Motta", iniciais: "MM",
    tipo: "Tutoria", modalidade: "Remoto", local: "Google Meet",
    gratuita: false, valor: 35, vagas: 5, vagasOcupadas: 0, nota: 4.7, totalAvaliacoes: 15,
    descricao: "Foco em joins, subconsultas e normalizacao.",
    horarios: [{ id: "Segunda-18:00", dia: "Segunda", inicio: "18:00", fim: "20:00" }],
  },
];
