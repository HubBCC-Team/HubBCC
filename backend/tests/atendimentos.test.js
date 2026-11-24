import request from "supertest";
import app from "../app.js";
import {
  criarUsuario,
  comToken,
  criarOferta,
  dataFutura,
  limparTudo,
} from "./helpers.js";

let aluno, outroAluno, monitor, outroMonitor, admin, oferta;

beforeAll(async () => {
  aluno = await criarUsuario("aluno");
  outroAluno = await criarUsuario("aluno");
  monitor = await criarUsuario("monitor");
  outroMonitor = await criarUsuario("monitor");
  admin = await criarUsuario("admin");
  oferta = criarOferta({ monitor, vagas: 50 });
});

afterAll(limparTudo);

let dia = 20;
async function novoAgendamento() {
  dia += 1;
  const res = await request(app)
    .post("/agendamentos")
    .set(comToken(aluno))
    .send({ ofertaId: oferta.id, data: dataFutura(dia), hora: "14:00" });
  return res.body;
}

const registro = (extra = {}) => ({
  compareceu: true,
  duracao: 60,
  observacoes: "Revisamos derivadas.",
  ...extra,
});

const registrar = (usuario, agendamentoId, reg = registro()) =>
  request(app)
    .post("/atendimentos")
    .set(comToken(usuario))
    .send({ agendamentoId, registro: reg });

describe("autenticacao", () => {
  test.each([
    ["get", "/atendimentos"],
    ["post", "/atendimentos"],
    ["put", "/atendimentos/1"],
    ["delete", "/atendimentos/1"],
  ])("%s %s sem token -> 401", async (metodo, url) => {
    expect((await request(app)[metodo](url)).status).toBe(401);
  });
});

describe("registrar atendimento", () => {
  test("monitor da oferta registra (201) e o agendamento vira Realizado", async () => {
    const ag = await novoAgendamento();
    const res = await registrar(monitor, ag.id);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      agendamentoId: ag.id,
      usuarioId: aluno.id,
      avaliacao: null,
    });
    expect(res.body.registro).toMatchObject({ compareceu: true, duracao: 60 });
    expect(res.body.registro.registradoEm).toBeTruthy();

    const detalhe = await request(app).get(`/agendamentos/${ag.id}`).set(comToken(aluno));
    expect(detalhe.body.situacao).toBe("Realizado");
    expect(detalhe.body.registro.observacoes).toBe("Revisamos derivadas.");
    expect(detalhe.body.atendimentoId).toBe(res.body.id);
  });

  test("aluno nao registra (403) e monitor de outra oferta tambem nao (403)", async () => {
    const ag = await novoAgendamento();
    expect((await registrar(aluno, ag.id)).status).toBe(403);
    expect((await registrar(outroMonitor, ag.id)).status).toBe(403);
  });

  test("admin pode registrar", async () => {
    const ag = await novoAgendamento();
    expect((await registrar(admin, ag.id)).status).toBe(201);
  });

  test("validacao: compareceu sem duracao minima -> 400; nao compareceu zera a duracao", async () => {
    const ag = await novoAgendamento();

    const ruim = await registrar(monitor, ag.id, registro({ duracao: 5 }));
    expect(ruim.status).toBe(400);

    const ausente = await registrar(monitor, ag.id, registro({ compareceu: false, duracao: 40 }));
    expect(ausente.status).toBe(201);
    expect(ausente.body.registro.duracao).toBe(0);
  });

  test("sem registro no corpo -> 400; agendamento inexistente -> 404", async () => {
    const ag = await novoAgendamento();
    const semRegistro = await request(app)
      .post("/atendimentos")
      .set(comToken(monitor))
      .send({ agendamentoId: ag.id });
    expect(semRegistro.status).toBe(400);

    expect((await registrar(monitor, 99999999)).status).toBe(404);
  });

  test("registrar duas vezes -> 409 (inclusive simultaneo)", async () => {
    const ag = await novoAgendamento();
    const respostas = await Promise.all([
      registrar(monitor, ag.id),
      registrar(monitor, ag.id),
      registrar(monitor, ag.id),
    ]);

    expect(respostas.map((r) => r.status).sort()).toEqual([201, 409, 409]);
  });

  test("nao registra atendimento de agendamento cancelado -> 409", async () => {
    const ag = await novoAgendamento();
    await request(app).delete(`/agendamentos/${ag.id}`).set(comToken(aluno));
    expect((await registrar(monitor, ag.id)).status).toBe(409);
  });
});

describe("avaliar e editar", () => {
  let ag, atendimento;

  beforeAll(async () => {
    ag = await novoAgendamento();
    atendimento = (await registrar(monitor, ag.id)).body;
  });

  const avaliacao = (extra = {}) => ({
    nota: 5,
    tags: ["Didatico", "Claro"],
    comentario: "Muito bom!",
    ...extra,
  });

  test("aluno avalia (200) e a nota aparece no agendamento", async () => {
    const res = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(aluno))
      .send({ avaliacao: avaliacao() });

    expect(res.status).toBe(200);
    expect(res.body.avaliacao).toMatchObject({ nota: 5, tags: ["Didatico", "Claro"] });

    const detalhe = await request(app).get(`/agendamentos/${ag.id}`).set(comToken(aluno));
    expect(detalhe.body.avaliacao.nota).toBe(5);
  });

  test.each([
    ["nota 6", { nota: 6 }],
    ["nota 0", { nota: 0 }],
    ["nota decimal", { nota: 3.5 }],
    ["tag invalida", { tags: ["Xpto"] }],
    ["comentario enorme", { comentario: "a".repeat(501) }],
  ])("avaliacao invalida (%s) -> 400", async (_nome, extra) => {
    const res = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(aluno))
      .send({ avaliacao: avaliacao(extra) });
    expect(res.status).toBe(400);
  });

  test("corpo vazio -> 400", async () => {
    const res = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(aluno))
      .send({});
    expect(res.status).toBe(400);
  });

  test("outro aluno e monitor nao avaliam (403)", async () => {
    const outro = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(outroAluno))
      .send({ avaliacao: avaliacao() });
    const doMonitor = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(monitor))
      .send({ avaliacao: avaliacao() });

    expect(outro.status).toBe(403);
    expect(doMonitor.status).toBe(403);
  });

  test("aluno nao edita o registro (403); monitor edita (200) e mantem registradoEm", async () => {
    const aluno403 = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(aluno))
      .send({ registro: registro({ observacoes: "adulterado" }) });
    expect(aluno403.status).toBe(403);

    const ok = await request(app)
      .put(`/atendimentos/${atendimento.id}`)
      .set(comToken(monitor))
      .send({ registro: registro({ observacoes: "Corrigido" }) });

    expect(ok.status).toBe(200);
    expect(ok.body.registro.observacoes).toBe("Corrigido");
    expect(ok.body.registro.registradoEm).toBe(atendimento.registro.registradoEm);
  });
});

describe("consultar e desfazer", () => {
  test("cada perfil ve so o que e seu", async () => {
    const ag = await novoAgendamento();
    const { body: atendimento } = await registrar(monitor, ag.id);

    const doAluno = await request(app).get("/atendimentos").set(comToken(aluno));
    const doOutroAluno = await request(app).get("/atendimentos").set(comToken(outroAluno));
    const doMonitor = await request(app)
      .get(`/atendimentos?agendamentoId=${ag.id}`)
      .set(comToken(monitor));
    const doOutroMonitor = await request(app).get("/atendimentos").set(comToken(outroMonitor));

    expect(doAluno.body.some((a) => a.id === atendimento.id)).toBe(true);
    expect(doOutroAluno.body).toEqual([]);
    expect(doMonitor.body.map((a) => a.id)).toEqual([atendimento.id]);
    expect(doOutroMonitor.body).toEqual([]);

    const proibido = await request(app)
      .get(`/atendimentos/${atendimento.id}`)
      .set(comToken(outroAluno));
    expect(proibido.status).toBe(403);
  });

  test("monitor desfaz o registro e o agendamento volta a Confirmado; aluno nao desfaz", async () => {
    const ag = await novoAgendamento();
    const { body: atendimento } = await registrar(monitor, ag.id);

    const aluno403 = await request(app)
      .delete(`/atendimentos/${atendimento.id}`)
      .set(comToken(aluno));
    expect(aluno403.status).toBe(403);

    const ok = await request(app)
      .delete(`/atendimentos/${atendimento.id}`)
      .set(comToken(monitor));
    expect(ok.status).toBe(204);

    const detalhe = await request(app).get(`/agendamentos/${ag.id}`).set(comToken(aluno));
    expect(detalhe.body).toMatchObject({ situacao: "Confirmado", registro: null, avaliacao: null });
  });
});
