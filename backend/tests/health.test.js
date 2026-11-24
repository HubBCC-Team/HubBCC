// Exemplo minimo de teste de API com Supertest (copie este arquivo para comecar).
import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

afterAll(() => prisma.$disconnect());

test("GET / responde 200 com a mensagem da API", async () => {
  const res = await request(app).get("/");

  expect(res.status).toBe(200);
  expect(res.body.mensagem).toMatch(/API HubBCC/);
});

test("rota protegida sem token responde 401", async () => {
  const res = await request(app).get("/agendamentos");

  expect(res.status).toBe(401);
});
