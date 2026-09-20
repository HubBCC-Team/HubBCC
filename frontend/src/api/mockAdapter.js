/* ---------------------------------------------------------------------------
   api/mockAdapter.js
   "SERVIDOR FALSO" do HubBCC.

   COMO FUNCIONA:
   A biblioteca axios-mock-adapter intercepta as chamadas do axios ANTES de
   elas sairem para a internet e responde usando os dados de src/mocks/db.js.
   Ou seja: o front acha que esta falando com um servidor de verdade.

   FORMATO DE CADA REGRA:
     mock.onGet("/caminho").reply(() => [statusHTTP, corpoDaResposta]);
     mock.onPost(/regex/).reply((config) => { ... });

   - config.data  -> corpo enviado no POST/PUT (vem como texto JSON)
   - config.params-> query string (?tipo=Evento)
   - config.url   -> caminho chamado

   COMO ADICIONAR UM NOVO ENDPOINT:
   1) Crie o array correspondente em src/mocks/db.js.
   2) Copie um dos blocos abaixo e ajuste caminho/logica.
   3) Crie a funcao equivalente em src/service/.

   QUANDO O BACKEND REAL FICAR PRONTO: apague este arquivo e a pasta mocks.
--------------------------------------------------------------------------- */

import MockAdapter from "axios-mock-adapter";
import { lerBanco, salvarBanco, resetarBanco, proximoId } from "../mocks/db.js";

// Atraso artificial (ms) para simular a latencia de rede e permitir que a
// equipe veja os estados de "carregando" nas telas.
const ATRASO_MS = 350;

// Le o corpo enviado pelo front (o axios manda como string JSON).
function corpo(config) {
  try {
    return config.data ? JSON.parse(config.data) : {};
  } catch {
    return {};
  }
}

// Extrai o id numerico do final da URL. Ex.: "/oportunidades/12" -> 12
function idDaUrl(url) {
  const partes = url.split("/").filter(Boolean);
  return Number(partes[partes.length - 1]);
}

export function ativarMock(instanciaAxios) {
  const mock = new MockAdapter(instanciaAxios, { delayResponse: ATRASO_MS });

  /* =======================================================================
     AUTENTICACAO
  ======================================================================= */

  // POST /auth/login — valida email e senha contra a lista de usuarios.
  mock.onPost("/auth/login").reply((config) => {
    const { email, senha } = corpo(config);
    const banco = lerBanco();
    const usuario = banco.usuarios.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.senha === senha
    );

    if (!usuario) {
      return [401, { mensagem: "E-mail ou senha invalidos." }];
    }

    // Nunca devolvemos a senha para o front.
    const { senha: _, ...usuarioSemSenha } = usuario;
    return [200, { token: `token-falso-${usuario.id}`, usuario: usuarioSemSenha }];
  });

  // POST /auth/cadastro — cria um novo aluno.
  mock.onPost("/auth/cadastro").reply((config) => {
    const dados = corpo(config);
    const banco = lerBanco();

    if (banco.usuarios.some((u) => u.email.toLowerCase() === String(dados.email).toLowerCase())) {
      return [409, { mensagem: "Ja existe uma conta com este e-mail." }];
    }

    const novo = {
      id: proximoId(banco.usuarios),
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      perfil: "aluno", // todo cadastro publico nasce como aluno
      matricula: dados.matricula ?? "",
      curso: "Bacharelado em Ciencia da Computacao",
      periodo: dados.periodo ?? "1o periodo",
      telefone: dados.telefone ?? "",
      // Iniciais usadas no avatar: primeira letra do primeiro e do ultimo nome.
      iniciais: String(dados.nome || "?")
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .filter((_, i, arr) => i === 0 || i === arr.length - 1)
        .join("")
        .toUpperCase(),
    };

    banco.usuarios.push(novo);
    salvarBanco(banco);

    const { senha: _, ...usuarioSemSenha } = novo;
    return [201, { token: `token-falso-${novo.id}`, usuario: usuarioSemSenha }];
  });

  // POST /auth/recuperar-senha — sempre responde sucesso (nao revela se o
  // e-mail existe, que e o comportamento recomendado em seguranca).
  mock.onPost("/auth/recuperar-senha").reply(() => [
    200,
    { mensagem: "Se o e-mail estiver cadastrado, enviaremos as instrucoes." },
  ]);

  /* =======================================================================
     DISCIPLINAS
  ======================================================================= */
  mock.onGet("/disciplinas").reply(() => [200, lerBanco().disciplinas]);

  /* =======================================================================
     OPORTUNIDADES ACADEMICAS
  ======================================================================= */

  // GET /oportunidades?busca=&tipo=&modalidade=&situacao=
  mock.onGet("/oportunidades").reply((config) => {
    const { busca = "", tipo = "", modalidade = "", situacao = "" } = config.params || {};
    let lista = lerBanco().oportunidades;

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (o) =>
          o.titulo.toLowerCase().includes(termo) ||
          o.area.toLowerCase().includes(termo) ||
          o.descricao.toLowerCase().includes(termo)
      );
    }
    if (tipo) lista = lista.filter((o) => o.tipo === tipo);
    if (modalidade) lista = lista.filter((o) => o.modalidade === modalidade);
    if (situacao) lista = lista.filter((o) => o.situacao === situacao);

    return [200, lista];
  });

  // GET /oportunidades/:id
  mock.onGet(/\/oportunidades\/\d+$/).reply((config) => {
    const item = lerBanco().oportunidades.find((o) => o.id === idDaUrl(config.url));
    return item ? [200, item] : [404, { mensagem: "Oportunidade nao encontrada." }];
  });

  // POST /oportunidades — cadastro de nova oportunidade.
  mock.onPost("/oportunidades").reply((config) => {
    const dados = corpo(config);
    const banco = lerBanco();
    const nova = {
      id: proximoId(banco.oportunidades),
      situacao: "Aberta",
      requisitos: [],
      atividades: [],
      ...dados,
    };
    banco.oportunidades.push(nova);
    salvarBanco(banco);
    return [201, nova];
  });

  // PUT /oportunidades/:id — alterar / encerrar.
  mock.onPut(/\/oportunidades\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const i = banco.oportunidades.findIndex((o) => o.id === idDaUrl(config.url));
    if (i === -1) return [404, { mensagem: "Oportunidade nao encontrada." }];
    banco.oportunidades[i] = { ...banco.oportunidades[i], ...corpo(config) };
    salvarBanco(banco);
    return [200, banco.oportunidades[i]];
  });

  // DELETE /oportunidades/:id
  mock.onDelete(/\/oportunidades\/\d+$/).reply((config) => {
    const banco = lerBanco();
    banco.oportunidades = banco.oportunidades.filter((o) => o.id !== idDaUrl(config.url));
    salvarBanco(banco);
    return [204];
  });

  /* =======================================================================
     CANDIDATURAS
  ======================================================================= */

  // GET /candidaturas?usuarioId=1&situacao=
  mock.onGet("/candidaturas").reply((config) => {
    const { usuarioId, situacao = "" } = config.params || {};
    let lista = lerBanco().candidaturas;
    if (usuarioId) lista = lista.filter((c) => c.usuarioId === Number(usuarioId));
    if (situacao) lista = lista.filter((c) => c.situacao === situacao);
    return [200, lista];
  });

  // POST /candidaturas — realizar candidatura.
  mock.onPost("/candidaturas").reply((config) => {
    const dados = corpo(config);
    const banco = lerBanco();

    // Regra de negocio: nao deixar o aluno se candidatar duas vezes.
    const jaExiste = banco.candidaturas.some(
      (c) =>
        c.usuarioId === dados.usuarioId &&
        c.oportunidadeId === dados.oportunidadeId &&
        c.situacao !== "Cancelada"
    );
    if (jaExiste) {
      return [409, { mensagem: "Voce ja se candidatou a esta oportunidade." }];
    }

    const oportunidade = banco.oportunidades.find((o) => o.id === dados.oportunidadeId);
    const nova = {
      id: proximoId(banco.candidaturas),
      dataEnvio: new Date().toISOString().slice(0, 10),
      situacao: "Em analise",
      oportunidadeTitulo: oportunidade?.titulo ?? "",
      tipo: oportunidade?.tipo ?? "",
      ...dados,
    };
    banco.candidaturas.push(nova);
    salvarBanco(banco);
    return [201, nova];
  });

  // PUT /candidaturas/:id — avaliar candidatura (aprovar/reprovar).
  mock.onPut(/\/candidaturas\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const i = banco.candidaturas.findIndex((c) => c.id === idDaUrl(config.url));
    if (i === -1) return [404, { mensagem: "Candidatura nao encontrada." }];
    banco.candidaturas[i] = { ...banco.candidaturas[i], ...corpo(config) };
    salvarBanco(banco);
    return [200, banco.candidaturas[i]];
  });

  // DELETE /candidaturas/:id — cancelar candidatura.
  mock.onDelete(/\/candidaturas\/\d+$/).reply((config) => {
    const banco = lerBanco();
    banco.candidaturas = banco.candidaturas.filter((c) => c.id !== idDaUrl(config.url));
    salvarBanco(banco);
    return [204];
  });

  /* =======================================================================
     OFERTAS DE APOIO ACADEMICO
  ======================================================================= */

  // GET /ofertas?busca=&disciplinaId=&tipo=&modalidade=&gratuita=
  mock.onGet("/ofertas").reply((config) => {
    const { busca = "", disciplinaId = "", tipo = "", modalidade = "", gratuita = "" } =
      config.params || {};
    let lista = lerBanco().ofertas;

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (o) =>
          o.titulo.toLowerCase().includes(termo) ||
          o.disciplina.toLowerCase().includes(termo) ||
          o.monitor.toLowerCase().includes(termo)
      );
    }
    if (disciplinaId) lista = lista.filter((o) => o.disciplinaId === Number(disciplinaId));
    if (tipo) lista = lista.filter((o) => o.tipo === tipo);
    if (modalidade) lista = lista.filter((o) => o.modalidade === modalidade);
    if (gratuita === "true") lista = lista.filter((o) => o.gratuita);

    return [200, lista];
  });

  // GET /ofertas/:id
  mock.onGet(/\/ofertas\/\d+$/).reply((config) => {
    const item = lerBanco().ofertas.find((o) => o.id === idDaUrl(config.url));
    return item ? [200, item] : [404, { mensagem: "Oferta nao encontrada." }];
  });

  // POST /ofertas — criar oferta de apoio.
  mock.onPost("/ofertas").reply((config) => {
    const dados = corpo(config);
    const banco = lerBanco();
    const disciplina = banco.disciplinas.find((d) => d.id === Number(dados.disciplinaId));
    const nova = {
      id: proximoId(banco.ofertas),
      disciplina: disciplina?.nome ?? "",
      vagasOcupadas: 0,
      nota: 0,
      totalAvaliacoes: 0,
      ...dados,
      disciplinaId: Number(dados.disciplinaId),
    };
    banco.ofertas.push(nova);
    salvarBanco(banco);
    return [201, nova];
  });

  // PUT /ofertas/:id — alterar oferta.
  mock.onPut(/\/ofertas\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const i = banco.ofertas.findIndex((o) => o.id === idDaUrl(config.url));
    if (i === -1) return [404, { mensagem: "Oferta nao encontrada." }];
    banco.ofertas[i] = { ...banco.ofertas[i], ...corpo(config) };
    salvarBanco(banco);
    return [200, banco.ofertas[i]];
  });

  // DELETE /ofertas/:id — cancelar oferta.
  mock.onDelete(/\/ofertas\/\d+$/).reply((config) => {
    const banco = lerBanco();
    banco.ofertas = banco.ofertas.filter((o) => o.id !== idDaUrl(config.url));
    salvarBanco(banco);
    return [204];
  });

  /* =======================================================================
     AGENDAMENTOS
  ======================================================================= */

  // GET /agendamentos?usuarioId=1&situacao=
  mock.onGet("/agendamentos").reply((config) => {
    const { usuarioId, situacao = "" } = config.params || {};
    let lista = lerBanco().agendamentos;
    if (usuarioId) lista = lista.filter((a) => a.usuarioId === Number(usuarioId));
    if (situacao) lista = lista.filter((a) => a.situacao === situacao);
    return [200, lista];
  });

  // POST /agendamentos — realizar agendamento.
  mock.onPost("/agendamentos").reply((config) => {
    const dados = corpo(config);
    const banco = lerBanco();
    const oferta = banco.ofertas.find((o) => o.id === Number(dados.ofertaId));

    if (!oferta) return [404, { mensagem: "Oferta nao encontrada." }];

    // Regra de negocio: nao permitir agendar sem vaga disponivel.
    if (oferta.vagasOcupadas >= oferta.vagas) {
      return [409, { mensagem: "Nao ha mais vagas nesta oferta." }];
    }

    // Regra de negocio: um aluno nao pode ter dois agendamentos no mesmo horario.
    const conflito = banco.agendamentos.some(
      (a) =>
        a.usuarioId === dados.usuarioId &&
        a.data === dados.data &&
        a.hora === dados.hora &&
        a.situacao === "Confirmado"
    );
    if (conflito) {
      return [409, { mensagem: "Voce ja possui um agendamento neste dia e horario." }];
    }

    const novo = {
      id: proximoId(banco.agendamentos),
      titulo: oferta.titulo,
      disciplina: oferta.disciplina,
      monitor: oferta.monitor,
      modalidade: oferta.modalidade,
      local: oferta.local,
      situacao: "Confirmado",
      avaliacao: null,
      registro: null,
      ...dados,
      ofertaId: Number(dados.ofertaId),
    };

    banco.agendamentos.push(novo);
    oferta.vagasOcupadas += 1; // ocupa a vaga
    salvarBanco(banco);
    return [201, novo];
  });

  // PUT /agendamentos/:id — reagendar, registrar atendimento ou avaliar.
  mock.onPut(/\/agendamentos\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const i = banco.agendamentos.findIndex((a) => a.id === idDaUrl(config.url));
    if (i === -1) return [404, { mensagem: "Agendamento nao encontrado." }];
    banco.agendamentos[i] = { ...banco.agendamentos[i], ...corpo(config) };
    salvarBanco(banco);
    return [200, banco.agendamentos[i]];
  });

  // DELETE /agendamentos/:id — cancelar e liberar a vaga na oferta.
  mock.onDelete(/\/agendamentos\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const agendamento = banco.agendamentos.find((a) => a.id === idDaUrl(config.url));
    if (agendamento) {
      const oferta = banco.ofertas.find((o) => o.id === agendamento.ofertaId);
      if (oferta && oferta.vagasOcupadas > 0) oferta.vagasOcupadas -= 1;
      agendamento.situacao = "Cancelado";
    }
    salvarBanco(banco);
    return [204];
  });

  /* =======================================================================
     ATIVIDADES COMPLEMENTARES
  ======================================================================= */

  // GET /atividades?usuarioId=1&categoria=
  mock.onGet("/atividades").reply((config) => {
    const { usuarioId, categoria = "" } = config.params || {};
    let lista = lerBanco().atividades;
    if (usuarioId) lista = lista.filter((a) => a.usuarioId === Number(usuarioId));
    if (categoria) lista = lista.filter((a) => a.categoria === categoria);
    return [200, lista];
  });

  // GET /atividades/resumo?usuarioId=1 — totais usados no dashboard.
  mock.onGet("/atividades/resumo").reply((config) => {
    const { usuarioId } = config.params || {};
    const banco = lerBanco();
    const lista = banco.atividades.filter((a) => a.usuarioId === Number(usuarioId));

    // Soma apenas o que ja foi aprovado (regra do curso).
    const horasAprovadas = lista
      .filter((a) => a.situacao === "Aprovada")
      .reduce((total, a) => total + a.horas, 0);

    // Agrupa as horas por categoria para montar a lista do dashboard.
    const porCategoria = {};
    lista.forEach((a) => {
      porCategoria[a.categoria] = (porCategoria[a.categoria] ?? 0) + a.horas;
    });

    return [
      200,
      {
        horasAprovadas,
        meta: banco.metaHorasComplementares,
        percentual: Math.round((horasAprovadas / banco.metaHorasComplementares) * 100),
        porCategoria,
        totalAtividades: lista.length,
      },
    ];
  });

  // POST /atividades — registrar atividade complementar.
  mock.onPost("/atividades").reply((config) => {
    const banco = lerBanco();
    const nova = {
      id: proximoId(banco.atividades),
      situacao: "Em analise", // toda atividade nova entra para conferencia
      ...corpo(config),
    };
    banco.atividades.push(nova);
    salvarBanco(banco);
    return [201, nova];
  });

  // PUT /atividades/:id
  mock.onPut(/\/atividades\/\d+$/).reply((config) => {
    const banco = lerBanco();
    const i = banco.atividades.findIndex((a) => a.id === idDaUrl(config.url));
    if (i === -1) return [404, { mensagem: "Atividade nao encontrada." }];
    banco.atividades[i] = { ...banco.atividades[i], ...corpo(config) };
    salvarBanco(banco);
    return [200, banco.atividades[i]];
  });

  // DELETE /atividades/:id
  mock.onDelete(/\/atividades\/\d+$/).reply((config) => {
    const banco = lerBanco();
    banco.atividades = banco.atividades.filter((a) => a.id !== idDaUrl(config.url));
    salvarBanco(banco);
    return [204];
  });

  /* =======================================================================
     UTILITARIOS DE DESENVOLVIMENTO
  ======================================================================= */

  // POST /dev/reset — volta o banco falso ao estado inicial.
  mock.onPost("/dev/reset").reply(() => {
    resetarBanco();
    return [200, { mensagem: "Dados de teste restaurados." }];
  });

  // Qualquer rota nao mapeada acima devolve 404 com mensagem clara,
  // em vez de travar silenciosamente.
  mock.onAny().reply((config) => [
    404,
    { mensagem: `Endpoint mock nao implementado: ${config.method?.toUpperCase()} ${config.url}` },
  ]);
}
