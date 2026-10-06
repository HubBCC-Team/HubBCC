/* ---------------------------------------------------------------------------
   server/server.js
   BACKEND MOCKADO do HubBCC usando JSON SERVER.

   Substitui o antigo src/api/mockAdapter.js + localStorage.
   Agora os dados ficam no arquivo frontend/db.json e TODA alteracao feita
   pelo sistema (criar, alterar, excluir) e gravada nesse arquivo.

   COMO FUNCIONA:
   - O JSON Server cria automaticamente o CRUD de cada colecao do db.json:
       GET    /oportunidades          GET    /oportunidades/1
       POST   /oportunidades          PUT    /oportunidades/1
       PATCH  /oportunidades/1        DELETE /oportunidades/1
   - Antes do CRUD automatico, os middlewares abaixo aplicam as REGRAS DE
     NEGOCIO que antes ficavam no mockAdapter (candidatura duplicada, vagas,
     conflito de horario, login, cadastro, resumo de horas...).

   COMO RODAR:  npm run server   (porta 3001)
   RESETAR:     npm run db:reset  (ou POST /dev/reset, botao do Perfil)
--------------------------------------------------------------------------- */
import jsonServer from "json-server";
import process from "node:process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PASTA = dirname(fileURLToPath(import.meta.url));
const ARQUIVO_DB = join(PASTA, "..", "db.json");
const ARQUIVO_SEED = join(PASTA, "db.seed.json");
const PORTA = Number(process.env.PORTA_API) || 3001;
const ATRASO_MS = 350; // simula latencia para os estados de "carregando"

const server = jsonServer.create();
const router = jsonServer.router(ARQUIVO_DB);
const db = router.db; // lowdb: db.get("colecao").find({ id }).value()

server.use(jsonServer.defaults()); // CORS, logs, arquivos estaticos
server.use(jsonServer.bodyParser);

/* -------------------------------------------------------------------------
   UTILITARIOS
------------------------------------------------------------------------- */
const erro = (res, status, mensagem) => res.status(status).json({ mensagem });

const semSenha = (usuario) => {
const copia = { ...usuario };
delete copia.senha;
return copia;
};

const proximoId = (colecao) => {
  const lista = db.get(colecao).value();
  return lista.length ? Math.max(...lista.map((i) => Number(i.id))) + 1 : 1;
};

const hoje = () => new Date().toISOString().slice(0, 10);

// Campos de relacionamento sempre como numero (o front as vezes manda string)
const CAMPOS_NUMERICOS = ["usuarioId", "oportunidadeId", "ofertaId", "disciplinaId", "monitorId"];
function normalizarCorpo(corpo) {
  if (!corpo || typeof corpo !== "object") return corpo;
  CAMPOS_NUMERICOS.forEach((c) => {
    if (corpo[c] !== undefined && corpo[c] !== "" && !Number.isNaN(Number(corpo[c]))) {
      corpo[c] = Number(corpo[c]);
    }
  });
  return corpo;
}

/* -------------------------------------------------------------------------
   MIDDLEWARES GERAIS
------------------------------------------------------------------------- */

// 1) Atraso artificial
server.use((req, res, next) => setTimeout(next, ATRASO_MS));

// 2) Normaliza corpo e query string
server.use((req, res, next) => {
  normalizarCorpo(req.body);

  // Filtros vazios (?tipo=) fariam o JSON Server devolver lista vazia.
  for (const [chave, valor] of Object.entries(req.query)) {
    if (valor === "" || valor === "Todos" || valor === "todos") delete req.query[chave];
  }

  // "busca" do front -> "q" (busca textual nativa do JSON Server)
  if (req.query.busca) {
    req.query.q = req.query.busca;
    delete req.query.busca;
  }

  // gratuita=false no filtro significa "todas", e nao "somente pagas"
  if (req.query.gratuita === "false") delete req.query.gratuita;

  next();
});

// 3) PUT vira PATCH: o front envia objetos parciais e o mock antigo fazia MERGE.
//    No JSON Server, PUT substitui o registro inteiro (apagaria campos).
server.use((req, res, next) => {
  if (req.method === "PUT") req.method = "PATCH";
  next();
});

/* -------------------------------------------------------------------------
   AUTENTICACAO (o JSON Server nao tem /auth, entao implementamos aqui)
   Simulacao academica: senha em texto puro NUNCA deve ser usada em producao.
------------------------------------------------------------------------- */
server.post("/auth/login", (req, res) => {
  const { email = "", senha = "" } = req.body;
  const usuario = db
    .get("usuarios")
    .find((u) => u.email.toLowerCase() === String(email).toLowerCase() && u.senha === senha)
    .value();

  if (!usuario) return erro(res, 401, "E-mail ou senha invalidos.");
  res.json({ token: `token-falso-${usuario.id}`, usuario: semSenha(usuario) });
});

server.post("/auth/cadastro", (req, res) => {
  const dados = req.body;
  const email = String(dados.email || "").toLowerCase();

  if (db.get("usuarios").find((u) => u.email.toLowerCase() === email).value()) {
    return erro(res, 409, "Ja existe uma conta com este e-mail.");
  }

  const novo = {
    id: proximoId("usuarios"),
    nome: dados.nome,
    email,
    senha: dados.senha,
    perfil: "aluno", // todo cadastro publico nasce como aluno
    matricula: dados.matricula ?? "",
    curso: "Bacharelado em Ciencia da Computacao",
    periodo: dados.periodo ?? "1o periodo",
    telefone: dados.telefone ?? "",
    iniciais: String(dados.nome || "?")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .join("")
      .toUpperCase(),
  };

  db.get("usuarios").push(novo).write();
  res.status(201).json({ token: `token-falso-${novo.id}`, usuario: semSenha(novo) });
});

server.post("/auth/recuperar-senha", (req, res) =>
  res.json({ mensagem: "Se o e-mail estiver cadastrado, enviaremos as instrucoes." }),
);

server.post("/auth/nova-senha", (req, res) => res.json({ mensagem: "Senha alterada." }));

// Nunca expor senhas na listagem de usuarios
server.get(["/usuarios", "/usuarios/:id"], (req, res, next) => {
  res.locals.ocultarSenha = true;
  next();
});

/* -------------------------------------------------------------------------
   OPORTUNIDADES
------------------------------------------------------------------------- */
server.post("/oportunidades", (req, res, next) => {
  req.body = { situacao: "Aberta", requisitos: [], atividades: [], ...req.body };
  next();
});

/* -------------------------------------------------------------------------
   CANDIDATURAS
------------------------------------------------------------------------- */
server.post("/candidaturas", (req, res, next) => {
  const dados = req.body;

  const jaExiste = db
    .get("candidaturas")
    .some(
      (c) =>
        c.usuarioId === dados.usuarioId &&
        c.oportunidadeId === dados.oportunidadeId &&
        c.situacao !== "Cancelada",
    )
    .value();
  if (jaExiste) return erro(res, 409, "Voce ja se candidatou a esta oportunidade.");

  const oportunidade = db.get("oportunidades").find({ id: dados.oportunidadeId }).value();
  if (!oportunidade) return erro(res, 404, "Oportunidade nao encontrada.");
  if (oportunidade.situacao === "Encerrada") return erro(res, 409, "Esta oportunidade esta encerrada.");

  req.body = {
    dataEnvio: hoje(),
    situacao: "Em analise",
    oportunidadeTitulo: oportunidade.titulo,
    tipo: oportunidade.tipo,
    ...dados,
  };
  next();
});

/* -------------------------------------------------------------------------
   OFERTAS DE APOIO
------------------------------------------------------------------------- */
server.post("/ofertas", (req, res, next) => {
  const disciplina = db.get("disciplinas").find({ id: req.body.disciplinaId }).value();
  req.body = {
    disciplina: disciplina?.nome ?? "",
    vagasOcupadas: 0,
    nota: 0,
    totalAvaliacoes: 0,
    horarios: [],
    ...req.body,
  };
  next();
});

/* -------------------------------------------------------------------------
   AGENDAMENTOS
------------------------------------------------------------------------- */
server.post("/agendamentos", (req, res) => {
  const dados = req.body;
  const ofertaRef = db.get("ofertas").find({ id: dados.ofertaId });
  const oferta = ofertaRef.value();

  if (!oferta) return erro(res, 404, "Oferta nao encontrada.");
  if (oferta.vagasOcupadas >= oferta.vagas) return erro(res, 409, "Nao ha mais vagas nesta oferta.");

  const conflito = db
    .get("agendamentos")
    .some(
      (a) =>
        a.usuarioId === dados.usuarioId &&
        a.data === dados.data &&
        a.hora === dados.hora &&
        a.situacao === "Confirmado",
    )
    .value();
  if (conflito) return erro(res, 409, "Voce ja possui um agendamento neste dia e horario.");

  const novo = {
    id: proximoId("agendamentos"),
    titulo: oferta.titulo,
    disciplina: oferta.disciplina,
    monitor: oferta.monitor,
    modalidade: oferta.modalidade,
    local: oferta.local,
    situacao: "Confirmado",
    avaliacao: null,
    registro: null,
    ...dados,
  };

  db.get("agendamentos").push(novo).write();
  ofertaRef.assign({ vagasOcupadas: oferta.vagasOcupadas + 1 }).write(); // ocupa a vaga
  res.status(201).json(novo);
});

// DELETE = cancelamento logico (mantem historico) + libera a vaga
server.delete("/agendamentos/:id", (req, res) => {
  const ref = db.get("agendamentos").find({ id: Number(req.params.id) });
  const agendamento = ref.value();
  if (!agendamento) return erro(res, 404, "Agendamento nao encontrado.");

  if (agendamento.situacao === "Confirmado") {
    const ofertaRef = db.get("ofertas").find({ id: agendamento.ofertaId });
    const oferta = ofertaRef.value();
    if (oferta && oferta.vagasOcupadas > 0) {
      ofertaRef.assign({ vagasOcupadas: oferta.vagasOcupadas - 1 }).write();
    }
  }
  ref.assign({ situacao: "Cancelado" }).write();
  res.status(204).end();
});

/* -------------------------------------------------------------------------
   ATIVIDADES COMPLEMENTARES
------------------------------------------------------------------------- */
// Precisa vir ANTES do router, senao "resumo" seria tratado como :id
server.get("/atividades/resumo", (req, res) => {
  const usuarioId = Number(req.query.usuarioId);
  const lista = db.get("atividades").filter({ usuarioId }).value();
  const meta = db.get("config.metaHorasComplementares").value() ?? 200;

  const horasAprovadas = lista
    .filter((a) => a.situacao === "Aprovada")
    .reduce((total, a) => total + Number(a.horas || 0), 0);

  const porCategoria = {};
  lista.forEach((a) => {
    porCategoria[a.categoria] = (porCategoria[a.categoria] ?? 0) + Number(a.horas || 0);
  });

  res.json({
    horasAprovadas,
    meta,
    percentual: Math.round((horasAprovadas / meta) * 100),
    porCategoria,
    totalAtividades: lista.length,
  });
});

server.post("/atividades", (req, res, next) => {
  req.body = { ...req.body, situacao: "Em analise" }; // toda atividade nova entra para conferencia
  next();
});

/* -------------------------------------------------------------------------
   DESENVOLVIMENTO: restaura os dados iniciais (db.seed.json -> db.json)
------------------------------------------------------------------------- */
server.post("/dev/reset", (req, res) => {
  db.setState(JSON.parse(readFileSync(ARQUIVO_SEED, "utf-8"))).write();
  res.json({ mensagem: "Dados de teste restaurados." });
});

/* -------------------------------------------------------------------------
   CRUD AUTOMATICO DO JSON SERVER
------------------------------------------------------------------------- */
router.render = (req, res) => {
  let dados = res.locals.data;
  if (res.locals.ocultarSenha) {
    dados = Array.isArray(dados) ? dados.map(semSenha) : dados && semSenha(dados);
  }
  // Mensagem amigavel no 404 do JSON Server (o axios.js le "mensagem")
  if (res.statusCode === 404) return res.json({ mensagem: "Registro nao encontrado." });
  res.json(dados);
};

server.use(router);

server.listen(PORTA, () => {
  console.log(`\n[HubBCC] JSON Server rodando em http://localhost:${PORTA}`);
  console.log(`[HubBCC] Dados persistidos em ${ARQUIVO_DB}\n`);
});
