import { test, expect } from "@playwright/test";

test.describe("Fluxo E2E — Atividades Complementares", () => {
  test("bloqueia acesso nao autenticado a rota protegida de atividades", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/atividades");
    await expect(page).toHaveURL(/login/);
  });

  test("login e navegacao para resumo de horas e atividades", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/login");

    await page.getByLabel(/e-mail/i).fill("aluno@cefet-rj.br");
    await page.getByLabel(/senha/i).fill("123456");
    await page.getByRole("button", { name: /entrar/i }).click();

    await page.goto("http://localhost:5173/atividades");
    await expect(
      page.getByRole("heading", { name: /atividades/i }),
    ).toBeVisible();
  });
});
