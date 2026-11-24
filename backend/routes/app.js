import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.js";
import oportunidadesRouter from "./routes/oportunidades.js";
import candidaturasRouter from "./routes/candidaturas.js";
import agendamentosRouter from "./routes/agendamentos.js";
import atendimentosRouter from "./routes/atendimentos.js";
import atividadesRouter from "./routes/atividades.js";
import disciplinasRouter from "./routes/disciplinas.js";
import ofertasRouter from "./routes/ofertas.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API HubBCC funcionando.",
  });
});

app.use("/auth", authRouter);
app.use("/oportunidades", oportunidadesRouter);
app.use("/candidaturas", candidaturasRouter);
app.use("/agendamentos", agendamentosRouter);
app.use("/atendimentos", atendimentosRouter);
app.use("/atividades", atividadesRouter);
app.use("/disciplinas", disciplinasRouter);
app.use("/ofertas", ofertasRouter);

export default app;
