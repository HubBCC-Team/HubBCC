import express from "express";
const router = express.Router();

let atividades = [];
let proximoId = 1;

// GET - Listar todas
router.get("/", (req, res) => {
  res.json(atividades);
});

// POST - Criar nova
router.post("/", (req, res) => {
  const novaAtividade = { 
    id: proximoId++, 
    ...req.body, 
    situacao: "Em análise" 
  };
  atividades.push(novaAtividade);
  res.status(201).json(novaAtividade);
});

// PATCH - Editar (com bloqueio se aprovada)
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const atividade = atividades.find((a) => a.id === id);
  
  if (!atividade) return res.status(404).json({ mensagem: "Atividade não encontrada." });
  if (atividade.situacao === "Aprovada") return res.status(409).json({ mensagem: "Não é possível editar uma atividade já aprovada." });

  Object.assign(atividade, req.body);
  res.json(atividade);
});

// DELETE - Remover (com bloqueio se aprovada)
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = atividades.findIndex((a) => a.id === id);
  
  if (index === -1) return res.status(404).json({ mensagem: "Atividade não encontrada." });
  if (atividades[index].situacao === "Aprovada") return res.status(409).json({ mensagem: "Não é possível excluir uma atividade já aprovada." });

  atividades.splice(index, 1);
  res.status(204).end();
});

export default router;