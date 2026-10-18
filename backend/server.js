import express from "express";
import cors from "cors";
import oportunidadesRouter from "./routes/oportunidades.js";
import candidaturasRouter from "./routes/candidaturas.js";
import agendamentosRouter from "./routes/agendamentos.js";
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API HubBCC funcionando." });
});

app.use("/oportunidades", oportunidadesRouter);
app.use("/candidaturas", candidaturasRouter);
app.use("/agendamentos", agendamentosRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
