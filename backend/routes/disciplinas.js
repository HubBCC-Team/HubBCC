import express from "express";
const router = express.Router();

let disciplinas = [];
let proximoId = 1;

// GET - Listar todas
router.get("/", (req, res) => {
  res.json(disciplinas);
});

// POST - Criar nova (com validação)
router.post("/", (req, res) => {
  const nome = req.body.nome ? req.body.nome.trim() : "";
  if (!nome) return res.status(400).json({ mensagem: "O nome da disciplina é obrigatório." });

  const jaExiste = disciplinas.some((d) => d.nome.toLowerCase() === nome.toLowerCase());
  if (jaExiste) return res.status(409).json({ mensagem: "Já existe uma disciplina cadastrada com este nome." });

  const novaDisciplina = { id: proximoId++, nome, ...req.body };
  disciplinas.push(novaDisciplina);
  res.status(201).json(novaDisciplina);
});

// DELETE - Remover disciplina
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = disciplinas.findIndex((d) => d.id === id);
  
  if (index === -1) return res.status(404).json({ mensagem: "Disciplina não encontrada." });
  
  // Nota: A validação de ofertas vinculadas precisaria importar o array de ofertas, 
  // mas num CRUD simples em memória isolado, apagamos diretamente:
  disciplinas.splice(index, 1);
  res.status(204).end();
});

export default router;