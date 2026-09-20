/* ---------------------------------------------------------------------------
   mocks/db.js
   "BANCO DE DADOS FALSO" do HubBCC.

   PARA QUE SERVE:
   Como ainda nao existe backend, este arquivo guarda todos os dados em memoria
   (arrays JavaScript comuns). O arquivo src/api/mockAdapter.js le e escreve
   nestes arrays para responder as chamadas do axios.

   COMO MEXER AQUI (manutencao):
   - Para ter mais dados de teste, basta adicionar objetos nos arrays abaixo.
   - Mantenha SEMPRE os mesmos campos (mesmas chaves) dos objetos existentes,
     porque as telas leem esses campos pelo nome.
   - Os dados sao salvos no localStorage do navegador, entao alteracoes feitas
     pelo usuario (criar oferta, agendar, etc.) sobrevivem ao F5.
     Para "zerar" tudo, use o botao Perfil > Resetar dados de teste,
     ou apague a chave "hubbcc_db" no localStorage.

   QUANDO O BACKEND REAL EXISTIR:
   Este arquivo e o mockAdapter.js podem ser simplesmente apagados. Veja a
   instrucao em src/api/axios.js.
--------------------------------------------------------------------------- */

// Chave usada para persistir o banco falso no localStorage do navegador.
const CHAVE_STORAGE = "hubbcc_db";

/* -------------------------------------------------------------------------
   DADOS INICIAIS (a "carga de sementes" do banco)
------------------------------------------------------------------------- */
function dadosIniciais() {
  return {
    // ---------------------------------------------------------------------
    // USUARIOS — usados na tela de Login.
    // Perfis possiveis: "aluno", "monitor", "admin".
    // O perfil controla o que aparece no menu lateral e quais rotas o usuario
    // consegue acessar (ver components/rotas/RotaPrivada.jsx).
    // ---------------------------------------------------------------------
    usuarios: [
      {
        id: 1,
        nome: "Mina Iura Mathias Monteiro",
        email: "aluno@hubbcc.br",
        senha: "123456",
        perfil: "aluno",
        matricula: "2023100045",
        curso: "Bacharelado em Ciencia da Computacao",
        periodo: "5o periodo",
        telefone: "(21) 99999-0000",
        iniciais: "MM",
      },
      {
        id: 2,
        nome: "Geovanne Gomes de Souza",
        email: "monitor@hubbcc.br",
        senha: "123456",
        perfil: "monitor",
        matricula: "2022100012",
        curso: "Bacharelado em Ciencia da Computacao",
        periodo: "7o periodo",
        telefone: "(21) 98888-0000",
        iniciais: "GS",
      },
      {
        id: 3,
        nome: "Marina Motta Sampaio",
        email: "admin@hubbcc.br",
        senha: "123456",
        perfil: "admin",
        matricula: "2021100003",
        curso: "Bacharelado em Ciencia da Computacao",
        periodo: "9o periodo",
        telefone: "(21) 97777-0000",
        iniciais: "MS",
      },
    ],

    // ---------------------------------------------------------------------
    // DISCIPLINAS — alimentam os filtros e os selects dos formularios.
    // ---------------------------------------------------------------------
    disciplinas: [
      { id: 1, codigo: "BCC101", nome: "Calculo I", periodo: 1 },
      { id: 2, codigo: "BCC102", nome: "Algebra Linear", periodo: 1 },
      { id: 3, codigo: "BCC201", nome: "Estrutura de Dados", periodo: 3 },
      { id: 4, codigo: "BCC202", nome: "Banco de Dados", periodo: 4 },
      { id: 5, codigo: "BCC301", nome: "Engenharia de Software", periodo: 5 },
      { id: 6, codigo: "BCC302", nome: "Redes de Computadores", periodo: 6 },
    ],

    // ---------------------------------------------------------------------
    // OPORTUNIDADES ACADEMICAS
    // tipo: "Iniciacao Cientifica" | "Extensao" | "Evento" | "Estagio" | "Monitoria"
    // situacao: "Aberta" | "Encerrada"
    // modalidade: "Presencial" | "Remoto" | "Hibrido"
    // ---------------------------------------------------------------------
    oportunidades: [
      {
        id: 1,
        titulo: "Monitoria de Calculo I",
        tipo: "Monitoria",
        area: "Matematica",
        departamento: "Departamento de Matematica",
        responsavel: "Profa. Ana Ribeiro",
        descricao:
          "Auxiliar a turma de Calculo I em listas de exercicios e plantoes de duvidas semanais, com acompanhamento do professor responsavel.",
        requisitos: [
          "Ter cursado Calculo I com nota igual ou superior a 8",
          "Disponibilidade de 12h semanais",
          "Boa comunicacao",
        ],
        atividades: [
          "Conduzir plantoes de duvidas",
          "Apoiar a correcao de listas",
          "Registrar a frequencia dos atendimentos",
        ],
        bolsa: "R$ 700,00",
        cargaHoraria: "12h/semana",
        modalidade: "Presencial",
        local: "Bloco A - Sala 210",
        vagas: 2,
        prazoInscricao: "2026-10-15",
        situacao: "Aberta",
      },
      {
        id: 2,
        titulo: "Iniciacao Cientifica - IA aplicada a saude",
        tipo: "Iniciacao Cientifica",
        area: "Inteligencia Artificial",
        departamento: "Departamento de Computacao",
        responsavel: "Prof. Carlos Mendes",
        descricao:
          "Projeto de pesquisa sobre modelos de aprendizado de maquina aplicados a triagem de exames clinicos.",
        requisitos: [
          "Python intermediario",
          "Ter cursado Estrutura de Dados",
          "Disponibilidade de 20h semanais",
        ],
        atividades: [
          "Revisao bibliografica",
          "Preparacao de bases de dados",
          "Treinamento e avaliacao de modelos",
        ],
        bolsa: "R$ 1.100,00",
        cargaHoraria: "20h/semana",
        modalidade: "Hibrido",
        local: "Laboratorio LIA",
        vagas: 1,
        prazoInscricao: "2026-10-30",
        situacao: "Aberta",
      },
      {
        id: 3,
        titulo: "Projeto de Extensao Web",
        tipo: "Extensao",
        area: "Desenvolvimento Web",
        departamento: "Departamento de Computacao",
        responsavel: "Profa. Lucia Prado",
        descricao:
          "Desenvolvimento de sites para instituicoes sociais parceiras da universidade.",
        requisitos: ["HTML, CSS e JavaScript", "Trabalho em equipe"],
        atividades: ["Levantamento de requisitos", "Implementacao", "Publicacao"],
        bolsa: "Nao remunerada",
        cargaHoraria: "8h/semana",
        modalidade: "Remoto",
        local: "Online",
        vagas: 6,
        prazoInscricao: "2026-09-28",
        situacao: "Aberta",
      },
      {
        id: 4,
        titulo: "Tutoria de Estrutura de Dados",
        tipo: "Monitoria",
        area: "Programacao",
        departamento: "Departamento de Computacao",
        responsavel: "Prof. Rafael Alves",
        descricao:
          "Tutoria voltada para listas encadeadas, arvores e analise de complexidade.",
        requisitos: ["Ter cursado Estrutura de Dados", "Disponibilidade noturna"],
        atividades: ["Atendimentos individuais", "Resolucao de exercicios"],
        bolsa: "R$ 500,00",
        cargaHoraria: "10h/semana",
        modalidade: "Remoto",
        local: "Online",
        vagas: 3,
        prazoInscricao: "2026-10-05",
        situacao: "Aberta",
      },
      {
        id: 5,
        titulo: "CodigoLab - Desenvolvimento",
        tipo: "Evento",
        area: "Desenvolvimento",
        departamento: "Centro Academico",
        responsavel: "Comissao organizadora",
        descricao:
          "Maratona de desenvolvimento de 48 horas com times de ate 4 pessoas.",
        requisitos: ["Estar matriculado no curso"],
        atividades: ["Participar da maratona", "Apresentar o projeto final"],
        bolsa: "Premiacao",
        cargaHoraria: "48h totais",
        modalidade: "Presencial",
        local: "Auditorio central",
        vagas: 40,
        prazoInscricao: "2026-09-25",
        situacao: "Aberta",
      },
      {
        id: 6,
        titulo: "Monitoria de Algebra Linear",
        tipo: "Monitoria",
        area: "Matematica",
        departamento: "Departamento de Matematica",
        responsavel: "Prof. Joao Bastos",
        descricao: "Apoio a turma de Algebra Linear no periodo da manha.",
        requisitos: ["Ter cursado Algebra Linear"],
        atividades: ["Plantao de duvidas"],
        bolsa: "R$ 600,00",
        cargaHoraria: "10h/semana",
        modalidade: "Presencial",
        local: "Bloco B - Sala 105",
        vagas: 1,
        prazoInscricao: "2026-09-20",
        situacao: "Encerrada",
      },
    ],

    // ---------------------------------------------------------------------
    // CANDIDATURAS — vinculo entre um usuario e uma oportunidade.
    // situacao: "Em analise" | "Aprovada" | "Reprovada" | "Cancelada"
    // ---------------------------------------------------------------------
    candidaturas: [
      {
        id: 1,
        usuarioId: 1,
        oportunidadeId: 1,
        oportunidadeTitulo: "Monitoria de Calculo I",
        tipo: "Monitoria",
        dataEnvio: "2026-09-02",
        situacao: "Em analise",
        carta: "Tenho interesse em apoiar a turma de Calculo I.",
      },
      {
        id: 2,
        usuarioId: 1,
        oportunidadeId: 2,
        oportunidadeTitulo: "Iniciacao Cientifica - IA aplicada a saude",
        tipo: "Pesquisa",
        dataEnvio: "2026-08-21",
        situacao: "Aprovada",
        carta: "Trabalho com Python ha dois anos.",
      },
      {
        id: 3,
        usuarioId: 1,
        oportunidadeId: 4,
        oportunidadeTitulo: "Tutoria de Estrutura de Dados",
        tipo: "Monitoria",
        dataEnvio: "2026-08-10",
        situacao: "Reprovada",
        carta: "Gostaria de contribuir com a disciplina.",
      },
    ],

    // ---------------------------------------------------------------------
    // OFERTAS DE APOIO ACADEMICO (monitorias e tutorias entre alunos)
    // ---------------------------------------------------------------------
    ofertas: [
      {
        id: 1,
        disciplinaId: 1,
        disciplina: "Calculo I",
        titulo: "Monitoria de Calculo I",
        assunto: "Limites, derivadas e integrais",
        monitorId: 2,
        monitor: "Geovanne Gomes",
        iniciais: "GS",
        tipo: "Monitoria",
        modalidade: "Presencial",
        local: "Bloco A - Sala 210",
        gratuita: true,
        valor: 0,
        vagas: 8,
        vagasOcupadas: 3,
        nota: 4.8,
        totalAvaliacoes: 24,
        descricao:
          "Atendimento em grupo com foco em resolucao de exercicios da lista oficial da disciplina.",
        horarios: [
          { id: 11, dia: "Segunda", inicio: "14:00", fim: "16:00" },
          { id: 12, dia: "Quarta", inicio: "14:00", fim: "16:00" },
        ],
      },
      {
        id: 2,
        disciplinaId: 3,
        disciplina: "Estrutura de Dados",
        titulo: "Tutoria de Estrutura de Dados",
        assunto: "Listas, pilhas, filas e arvores",
        monitorId: 3,
        monitor: "Marina Motta",
        iniciais: "MS",
        tipo: "Tutoria",
        modalidade: "Remoto",
        local: "Google Meet",
        gratuita: false,
        valor: 40,
        vagas: 4,
        vagasOcupadas: 1,
        nota: 4.9,
        totalAvaliacoes: 12,
        descricao: "Atendimento individual com exercicios guiados em C.",
        horarios: [
          { id: 21, dia: "Terca", inicio: "19:00", fim: "20:00" },
          { id: 22, dia: "Quinta", inicio: "19:00", fim: "20:00" },
        ],
      },
      {
        id: 3,
        disciplinaId: 2,
        disciplina: "Algebra Linear",
        titulo: "Monitoria de Algebra Linear",
        assunto: "Matrizes e espacos vetoriais",
        monitorId: 2,
        monitor: "Geovanne Gomes",
        iniciais: "GS",
        tipo: "Monitoria",
        modalidade: "Hibrido",
        local: "Bloco B - Sala 105",
        gratuita: true,
        valor: 0,
        vagas: 6,
        vagasOcupadas: 6,
        nota: 4.6,
        totalAvaliacoes: 9,
        descricao: "Revisao de conteudo antes das provas.",
        horarios: [{ id: 31, dia: "Sexta", inicio: "10:00", fim: "12:00" }],
      },
      {
        id: 4,
        disciplinaId: 4,
        disciplina: "Banco de Dados",
        titulo: "Tutoria de SQL",
        assunto: "Modelagem e consultas SQL",
        monitorId: 3,
        monitor: "Marina Motta",
        iniciais: "MS",
        tipo: "Tutoria",
        modalidade: "Remoto",
        local: "Google Meet",
        gratuita: false,
        valor: 35,
        vagas: 5,
        vagasOcupadas: 2,
        nota: 4.7,
        totalAvaliacoes: 15,
        descricao: "Foco em joins, subconsultas e normalizacao.",
        horarios: [{ id: 41, dia: "Segunda", inicio: "18:00", fim: "19:00" }],
      },
      {
        id: 5,
        disciplinaId: 5,
        disciplina: "Engenharia de Software",
        titulo: "Monitoria de Eng. de Software",
        assunto: "Requisitos e prototipacao",
        monitorId: 2,
        monitor: "Geovanne Gomes",
        iniciais: "GS",
        tipo: "Monitoria",
        modalidade: "Presencial",
        local: "Laboratorio 3",
        gratuita: true,
        valor: 0,
        vagas: 10,
        vagasOcupadas: 4,
        nota: 4.5,
        totalAvaliacoes: 7,
        descricao: "Apoio para os trabalhos praticos da disciplina.",
        horarios: [{ id: 51, dia: "Quarta", inicio: "16:00", fim: "18:00" }],
      },
      {
        id: 6,
        disciplinaId: 6,
        disciplina: "Redes de Computadores",
        titulo: "Tutoria de Redes",
        assunto: "Camadas TCP/IP e roteamento",
        monitorId: 3,
        monitor: "Marina Motta",
        iniciais: "MS",
        tipo: "Tutoria",
        modalidade: "Remoto",
        local: "Google Meet",
        gratuita: false,
        valor: 45,
        vagas: 3,
        vagasOcupadas: 0,
        nota: 4.4,
        totalAvaliacoes: 5,
        descricao: "Preparacao para a prova pratica de redes.",
        horarios: [{ id: 61, dia: "Sexta", inicio: "20:00", fim: "21:00" }],
      },
    ],

    // ---------------------------------------------------------------------
    // AGENDAMENTOS
    // situacao: "Confirmado" | "Realizado" | "Cancelado"
    // avaliacao: null enquanto o aluno nao avaliar o atendimento
    // ---------------------------------------------------------------------
    agendamentos: [
      {
        id: 1,
        usuarioId: 1,
        ofertaId: 1,
        titulo: "Monitoria de Calculo I",
        disciplina: "Calculo I",
        monitor: "Geovanne Gomes",
        data: "2026-09-22",
        hora: "14:00",
        modalidade: "Presencial",
        local: "Bloco A - Sala 210",
        situacao: "Confirmado",
        avaliacao: null,
        registro: null,
      },
      {
        id: 2,
        usuarioId: 1,
        ofertaId: 2,
        titulo: "Tutoria de Estrutura de Dados",
        disciplina: "Estrutura de Dados",
        monitor: "Marina Motta",
        data: "2026-09-24",
        hora: "19:00",
        modalidade: "Remoto",
        local: "Google Meet",
        situacao: "Confirmado",
        avaliacao: null,
        registro: null,
      },
      {
        id: 3,
        usuarioId: 1,
        ofertaId: 3,
        titulo: "Monitoria de Algebra Linear",
        disciplina: "Algebra Linear",
        monitor: "Geovanne Gomes",
        data: "2026-09-10",
        hora: "10:00",
        modalidade: "Hibrido",
        local: "Bloco B - Sala 105",
        situacao: "Realizado",
        avaliacao: { nota: 5, comentario: "Otimo atendimento.", tags: ["Didatico"] },
        registro: { compareceu: true, duracao: 120, observacoes: "Revisao completa." },
      },
    ],

    // ---------------------------------------------------------------------
    // ATIVIDADES COMPLEMENTARES
    // situacao: "Aprovada" | "Em analise" | "Recusada"
    // ---------------------------------------------------------------------
    atividades: [
      {
        id: 1,
        usuarioId: 1,
        titulo: "Monitoria de Estrutura de Dados",
        categoria: "Ensino",
        data: "2026-03-14",
        horas: 40,
        situacao: "Aprovada",
        comprovante: "certificado-monitoria.pdf",
      },
      {
        id: 2,
        usuarioId: 1,
        titulo: "Semana Nacional de Ciencia",
        categoria: "Evento",
        data: "2026-05-08",
        horas: 20,
        situacao: "Aprovada",
        comprovante: "certificado-semana.pdf",
      },
      {
        id: 3,
        usuarioId: 1,
        titulo: "Projeto de Extensao Web",
        categoria: "Extensao",
        data: "2026-06-30",
        horas: 60,
        situacao: "Em analise",
        comprovante: "declaracao-extensao.pdf",
      },
      {
        id: 4,
        usuarioId: 1,
        titulo: "Iniciacao Cientifica - IA",
        categoria: "Pesquisa",
        data: "2026-07-22",
        horas: 28,
        situacao: "Aprovada",
        comprovante: "declaracao-ic.pdf",
      },
    ],

    // Meta de horas complementares exigida pelo curso (usada nas barras de progresso).
    metaHorasComplementares: 200,
  };
}

/* -------------------------------------------------------------------------
   PERSISTENCIA NO NAVEGADOR
------------------------------------------------------------------------- */

// Le o banco do localStorage. Se ainda nao existir, cria com os dados iniciais.
export function lerBanco() {
  const salvo = localStorage.getItem(CHAVE_STORAGE);
  if (salvo) {
    try {
      return JSON.parse(salvo);
    } catch {
      // Se o JSON estiver corrompido, recomeca do zero.
      console.warn("[mock] banco corrompido, recriando dados iniciais");
    }
  }
  const novo = dadosIniciais();
  salvarBanco(novo);
  return novo;
}

// Grava o banco inteiro de volta no localStorage.
export function salvarBanco(banco) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(banco));
}

// Apaga tudo e volta aos dados de fabrica (usado no botao "Resetar dados").
export function resetarBanco() {
  localStorage.removeItem(CHAVE_STORAGE);
  return lerBanco();
}

// Gera o proximo id de uma colecao (simula o auto-incremento do banco real).
export function proximoId(lista) {
  return lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
}
