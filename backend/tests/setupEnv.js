// Roda antes de cada arquivo de teste.
// Os testes NUNCA usam o DATABASE_URL de desenvolvimento: usam TEST_DATABASE_URL
// (definida em backend/.env.test) para nao apagar dados do banco do dia a dia.
import dotenv from "dotenv";

dotenv.config({ path: ".env.test", quiet: true });

if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "Defina TEST_DATABASE_URL em backend/.env.test (veja .env.test.example).",
  );
}

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_SECRET = process.env.JWT_SECRET || "segredo-de-teste";
