import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";
import {
  criarUsuario,
  comToken,
  criarOferta,
  dataFutura,
  limparTudo,
} from "./helpers.js";

let alunoA, alunoB, alunoC, monitor, outroMonitor, admin, oferta;

beforeAll(async () => {
  [alunoA, alunoB, alunoC, admin] = await Promise.all([
    criarUsuario("aluno"),
    criarUsuario("aluno"),
    criarUsuario("aluno"),
    criarUsuario("admin"),
  ]);
  monitor = await criarUsuario("monitor");
  outroMonitor = await criarUsuario("monitor");
  oferta = criarOferta({ monitor, vagas: 50 });
});

afterAll(limparTudo);

const agendar = (usuario, corpo, cabecalhos = {}) =>
  request(app)
    .post("/agendamentos")
    .set(comToken(usuario))
    .set(cabecalhos)
    .send(corpo);

const corpo = (extra = {}) => ({
  ofertaId: oferta.id,
  data: dataFutura(3),
  hora: "14:00",
  ...extra,
});

describe("autenticacao", () => {
  test.each([
    ["get", "/agendamentos"],
    ["get", "/agendamentos/1"],
    ["post", "/agendamentos"],
    ["put", "/agendamentos/1"],
    ["delete", "/agendamentos/1"],
  ])("%s %s sem token -> 401", async (metodo, url) => {
    const res = await request(app)[metodo](url);
    expect(res.status).toBe(401);
  });

  test("token invalido -> 401", async () => {
    const res = await request(app)
      .get("/agendamentos")
      .set("Authorization", "Bearer lixo");
    expect(res.status).toBe(401);
  });
});

describe("POST /agendamentos", () => {
  test("cria o agendamento para o dono do token (201) no formato do frontend", async () => {
    const res = await agendar(alunoA, corpo({ hora: "08:00" }));

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      usuarioId: alunoA.id,
      ofertaId: oferta.id,
      monitor: monitor.nome,
      data: dataFutura(3),
      hora: "08:00",
      situacao: "Confirmado",
      registro: null,
      avaliacao: null,
    });
  });

  test("ignora usuarioId de outra pessoa vindo de aluno (403)", async () => {
    const res = await agendar(alunoA, corpo({ usuarioId: alunoB.id, hora: "08:30" }));
    expect(res.status).toBe(403);
  });

  test("admin pode agendar em nome de um aluno", async () => {
    const res = await agendar(admin, corpo({ usuarioId: alunoC.id, hora: "09:00" }));
    expect(res.status).toBe(201);
    expect(res.body.usuarioId).toBe(alunoC.id);
  });

  test.each([
    ["data no passado", { data: "2020-01-01" }],
    ["data inexistente", { data: "2030-02-31" }],
    ["data fora do formato", { data: "10/10/2030" }],
    ["hora invalida", { hora: "25:99" }],
    ["sem ofertaId", { ofertaId: undefined }],
  ])("validacao: %s -> 400", async (_nome, extra) => {
    const res = await agendar(alunoA, corpo(extra));
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBeTruthy();
  });

  test("oferta inexistente -> 404", async () => {
    const res = await agendar(alunoA, corpo({ ofertaId: 99999999 }));
    expect(res.status).toBe(404);
  });

  test("mesmo aluno, mesmo dia e horario -> 409", async () => {
    const dados = corpo({ hora: "10:00" });
    expect((await agendar(alunoB, dados)).status).toBe(201);

    const repetido = await agendar(alunoB, dados);
    expect(repetido.status).toBe(409);
    expect(repetido.body.mensagem).toMatch(/dia e horario/);
  });
});

describe("idempotencia", () => {
  test("mesma Idempotency-Key duas vezes cria um unico agendamento", async () => {
    const dados = corpo({ hora: "11:00" });
    const chave = { "Idempotency-Key": "chave-teste-0001" };

    const primeira = await agendar(alunoC, dados, chave);
    const segunda = await agendar(alunoC, dados, chave);

    expect(primeira.status).toBe(201);
    expect(segunda.status).toBe(200);
    expect(segunda.headers["idempotency-replayed"]).toBe("true");
    expect(segunda.body.id).toBe(primeira.body.id);

    const total = await prisma.agendamento.count({
      where: { usuarioId: alunoC.id, idempotencyKey: "chave-teste-0001" },
    });
    expect(total).toBe(1);
  });

  test("requisicoes simultaneas com a mesma chave criam so um registro", async () => {
    const dados = corpo({ hora: "12:00" });
    const chave = { "Idempotency-Key": "chave-simultanea-01" };

    const respostas = await Promise.all(
      Array.from({ length: 6 }, () => agendar(alunoA, dados, chave)),
    );

    const ids = new Set(respostas.map((r) => r.body.id));
    expect(respostas.every((r) => [200, 201].includes(r.status))).toBe(true);
    expect(ids.size).toBe(1);

    const total = await prisma.agendamento.count({
      where: { usuarioId: alunoA.id, idempotencyKey: "chave-simultanea-01" },
    });
    expect(total).toBe(1);
  });

  test("mesma chave com dados diferentes -> 422", async () => {
    const chave = { "Idempotency-Key": "chave-teste-0002" };
    expect((await agendar(alunoB, corpo({ hora: "13:00" }), chave)).status).toBe(201);

    const res = await agendar(alunoB, corpo({ hora: "13:30" }), chave);
    expect(res.status).toBe(422);
  });

  test("a chave e isolada por usuario", async () => {
    const chave = { "Idempotency-Key": "chave-compartilhada" };
    const a = await agendar(alunoA, corpo({ hora: "15:00" }), chave);
    const b = await agendar(alunoB, corpo({ hora: "15:00" }), chave);

    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
    expect(a.body.id).not.toBe(b.body.id);
  });

  test("chave curta demais -> 400", async () => {
    const res = await agendar(alunoA, corpo({ hora: "16:00" }), {
      "Idempotency-Key": "abc",
    });
    expect(res.status).toBe(400);
  });
});

describe("vagas", () => {
  test("nao ha vagas -> 409 e cancelar libera a vaga", async () => {
    const pequena = criarOferta({ monitor, vagas: 1 });
    const dados = { ofertaId: pequena.id, data: dataFutura(5), hora: "09:00" };

    const primeiro = await agendar(alunoA, dados);
    expect(primeiro.status).toBe(201);
    expect(pequena.vagasOcupadas).toBe(1);

    const semVaga = await agendar(alunoB, dados);
    expect(semVaga.status).toBe(409);
    expect(semVaga.body.mensagem).toMatch(/vagas/);

    const cancelado = await request(app)
      .delete(`/agendamentos/${primeiro.body.id}`)
      .set(comToken(alunoA));
    expect(cancelado.status).toBe(204);
    expect(pequena.vagasOcupadas).toBe(0);

    expect((await agendar(alunoB, dados)).status).toBe(201);
  });

  test("tentativas simultaneas nao passam do limite de vagas", async () => {
    const unica = criarOferta({ monitor, vagas: 1 });
    const dados = { ofertaId: unica.id, data: dataFutura(6), hora: "09:00" };

    const respostas = await Promise.all(
      [alunoA, alunoB, alunoC].map((aluno) => agendar(aluno, dados)),
    );

    const status = respostas.map((r) => r.status).sort();
    expect(status).toEqual([201, 409, 409]);
    expect(
      await prisma.agendamento.count({ where: { ofertaId: unica.id } }),
    ).toBe(1);
  });
});

describe("ownership e listagem", () => {
  let doA;

  beforeAll(async () => {
    const res = await agendar(alunoA, corpo({ data: dataFutura(7), hora: "17:00" }));
    doA = res.body;
  });

  test("aluno B nao ve, nao altera e nao cancela o agendamento do aluno A (403)", async () => {
    const ver = await request(app).get(`/agendamentos/${doA.id}`).set(comToken(alunoB));
    const mexer = await request(app)
      .put(`/agendamentos/${doA.id}`)
      .set(comToken(alunoB))
      .send({ data: dataFutura(8), hora: "17:00" });
    const cancelar = await request(app)
      .delete(`/agendamentos/${doA.id}`)
      .set(comToken(alunoB));

    expect(ver.status).toBe(403);
    expect(mexer.status).toBe(403);
    expect(cancelar.status).toBe(403);
  });

  test("aluno lista so os proprios, mesmo pedindo ?usuarioId de outro", async () => {
    const res = await request(app)
      .get(`/agendamentos?usuarioId=${alunoA.id}`)
      .set(comToken(alunoB));

    expect(res.status).toBe(200);
    expect(res.body.every((a) => a.usuarioId === alunoB.id)).toBe(true);
  });

  test("filtra por situacao e ordena por data", async () => {
    const res = await request(app)
      .get("/agendamentos?situacao=Confirmado&_sort=data&_order=asc")
      .set(comToken(alunoA));

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(1);
    expect(res.body.every((a) => a.situacao === "Confirmado")).toBe(true);
    const datas = res.body.map((a) => `${a.data} ${a.hora}`);
    expect(datas).toEqual([...datas].sort());
  });

  test("situacao invalida no filtro -> 400", async () => {
    const res = await request(app).get("/agendamentos?situacao=Xpto").set(comToken(alunoA));
    expect(res.status).toBe(400);
  });

  test("monitor ve os agendamentos da propria oferta; outro monitor nao", async () => {
    const meu = await request(app).get("/agendamentos").set(comToken(monitor));
    const alheio = await request(app).get("/agendamentos").set(comToken(outroMonitor));
    const detalhe = await request(app).get(`/agendamentos/${doA.id}`).set(comToken(outroMonitor));

    expect(meu.body.some((a) => a.id === doA.id)).toBe(true);
    expect(alheio.body).toEqual([]);
    expect(detalhe.status).toBe(403);
  });

  test("admin ve todos", async () => {
    const res = await request(app).get("/agendamentos").set(comToken(admin));
    expect(res.body.some((a) => a.id === doA.id)).toBe(true);
  });

  test("id inexistente -> 404 e id invalido -> 400", async () => {
    expect((await request(app).get("/agendamentos/99999999").set(comToken(admin))).status).toBe(404);
    expect((await request(app).get("/agendamentos/abc").set(comToken(admin))).status).toBe(400);
  });
});

describe("reagendar e cancelar", () => {
  test("reagenda (200) e bloqueia conflito (409)", async () => {
    const um = await agendar(alunoB, corpo({ data: dataFutura(9), hora: "08:00" }));
    const dois = await agendar(alunoB, corpo({ data: dataFutura(9), hora: "09:00" }));

    const ok = await request(app)
      .put(`/agendamentos/${um.body.id}`)
      .set(comToken(alunoB))
      .send({ data: dataFutura(10), hora: "08:00" });
    expect(ok.status).toBe(200);
    expect(ok.body.data).toBe(dataFutura(10));

    const choque = await request(app)
      .put(`/agendamentos/${dois.body.id}`)
      .set(comToken(alunoB))
      .send({ data: dataFutura(10), hora: "08:00" });
    expect(choque.status).toBe(409);
  });

  test("dados invalidos no reagendamento -> 400", async () => {
    const criado = await agendar(alunoB, corpo({ data: dataFutura(11), hora: "08:00" }));
    const res = await request(app)
      .put(`/agendamentos/${criado.body.id}`)
      .set(comToken(alunoB))
      .send({ data: "2020-01-01", hora: "08:00" });
    expect(res.status).toBe(400);
  });

  test("cancelar marca como Cancelado, e repetir continua 204; nao reagenda cancelado", async () => {
    const criado = await agendar(alunoB, corpo({ data: dataFutura(12), hora: "08:00" }));
    const url = `/agendamentos/${criado.body.id}`;

    expect((await request(app).delete(url).set(comToken(alunoB))).status).toBe(204);
    expect((await request(app).delete(url).set(comToken(alunoB))).status).toBe(204);

    const detalhe = await request(app).get(url).set(comToken(alunoB));
    expect(detalhe.body.situacao).toBe("Cancelado");

    const reagendar = await request(app)
      .put(url)
      .set(comToken(alunoB))
      .send({ data: dataFutura(13), hora: "08:00" });
    expect(reagendar.status).toBe(409);
  });
});
