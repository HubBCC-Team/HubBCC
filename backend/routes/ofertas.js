
import express from "express";
import { ofertas } from "../data/ofertas.js";
import {
  ofertaCriacaoSchema,
  ofertaAtualizacaoSchema,
  ofertaFiltrosSchema,
} from "../schemas/ofertaSchema.js";

const router = express.Router();

/* ------------------------------- AUXILIARES ------------------------------ */

const proximoId = () => ofertas.reduce((maior, o) => Math.max(maior, o.id), 0) + 1;
const acharOferta = (id) => ofertas.find((o) => o.id === Number(id));
const naoEncontrada = (res) => res.status(404).json({ mensagem: "Oferta nao encontrada." });

// Valida com Zod. Devolve os dados limpos, ou responde 400 e devolve null.
function validar(schema, dados, res) {
  const resultado = schema.safeParse(dados ?? {});
  if (resultado.success) return resultado.data;
  const erros = resultado.error.issues.map((p) => ({
    campo: p.path.join(".") || null,
    mensagem: p.message,
  }));
  res.status(400).json({ mensagem: erros[0].mensagem, erros });
  return null;
}

// "Geovanne Gomes" -> "GG"
function iniciaisDe(nome = "") {
  const partes = String(nome).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (partes[0][0] + ultima).toUpperCase();
}

// Regra de dono: responde 400/403 e devolve true quando NAO pode continuar.
function bloqueiaNaoDono(oferta, usuarioId, res) {
  if (!usuarioId) {
    res.status(400).json({ mensagem: "Informe o usuario que esta fazendo a alteracao." });
    return true;
  }
  if (oferta.monitorId !== Number(usuarioId)) {
    res.status(403).json({
      mensagem: "Somente o monitor que cadastrou esta oferta pode altera-la ou cancela-la.",
    });
    return true;
  }
  return false;
}

/* ---------------------------------- READ --------------------------------- */

// GET /ofertas?busca=&disciplinaId=&tipo=&modalidade=&gratuita=&monitorId=
router.get("/", (req, res) => {
  const filtros = validar(ofertaFiltrosSchema, req.query, res);
  if (!filtros) return;

  const { busca, disciplinaId, tipo, modalidade, gratuita, monitorId } = filtros;
  let lista = [...ofertas];

  if (busca) {
    const termo = busca.toLowerCase();
    lista = lista.filter((o) =>
      [o.titulo, o.disciplina, o.monitor].some((t) => String(t).toLowerCase().includes(termo))
    );
  }
  if (disciplinaId) lista = lista.filter((o) => o.disciplinaId === Number(disciplinaId));
  if (tipo) lista = lista.filter((o) => o.tipo === tipo);
  if (modalidade) lista = lista.filter((o) => o.modalidade === modalidade);
  if (gratuita === "true") lista = lista.filter((o) => o.gratuita);
  if (gratuita === "false") lista = lista.filter((o) => !o.gratuita);
  if (monitorId) lista = lista.filter((o) => o.monitorId === Number(monitorId));

  res.json(lista);
});

// GET /ofertas/:id
router.get("/:id", (req, res) => {
  const oferta = acharOferta(req.params.id);
  if (!oferta) return naoEncontrada(res);
  res.json(oferta);
});

/* --------------------------------- CREATE -------------------------------- */

// POST /ofertas
router.post("/", (req, res) => {
  const monitorId = Number(req.body?.monitorId);
  if (!Number.isInteger(monitorId) || monitorId <= 0) {
    return res.status(400).json({ mensagem: "Informe o monitor responsavel." });
  }
  const monitor = String(req.body?.monitor ?? "");

  // O Zod descarta campos controlados pelo servidor (id, vagasOcupadas, nota...).
  const dados = validar(ofertaCriacaoSchema, req.body, res);
  if (!dados) return;

  const nova = {
    ...dados,
    id: proximoId(),
    monitorId,
    monitor,
    iniciais: iniciaisDe(monitor),
    vagasOcupadas: 0,
    nota: 0,
    totalAvaliacoes: 0,
  };

  ofertas.push(nova);
  res.status(201).json(nova);
});

/* --------------------------------- UPDATE -------------------------------- */

// PUT /ofertas/:id
router.put("/:id", (req, res) => {
  const oferta = acharOferta(req.params.id);
  if (!oferta) return naoEncontrada(res);
  if (bloqueiaNaoDono(oferta, req.body?.usuarioId, res)) return;

  const dados = validar(ofertaAtualizacaoSchema, req.body, res);
  if (!dados) return;

  // Nao reduz vagas abaixo das ja ocupadas.
  if (dados.vagas !== undefined && dados.vagas < oferta.vagasOcupadas) {
    return res.status(409).json({
      mensagem: `Ja existem ${oferta.vagasOcupadas} vaga(s) ocupada(s). Nao e possivel reduzir abaixo disso.`,
    });
  }

  // Regra de valor considerando o que ja esta salvo.
  const gratuita = dados.gratuita ?? oferta.gratuita;
  const valor = dados.valor ?? oferta.valor;
  if (gratuita) dados.valor = 0;
  else if (!(valor > 0)) {
    return res.status(400).json({ mensagem: "Informe o valor por atendimento." });
  }

  Object.assign(oferta, dados);
  res.json(oferta);
});

/* --------------------------------- DELETE -------------------------------- */

// DELETE /ofertas/:id?usuarioId=2
router.delete("/:id", (req, res) => {
  const oferta = acharOferta(req.params.id);
  if (!oferta) return naoEncontrada(res);
  if (bloqueiaNaoDono(oferta, req.query?.usuarioId, res)) return;

  ofertas.splice(ofertas.indexOf(oferta), 1);
  res.status(204).send();
});

export default router;
