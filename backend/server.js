import express from "express";
import cors from "cors";
import oportunidadesRouter from "./routes/oportunidades.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API HubBCC funcionando." });
});

app.use("/oportunidades", oportunidadesRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
