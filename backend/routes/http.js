// Helpers HTTP compartilhados pelas rotas de Agendamentos e Atendimentos.

// Valida com Zod. Devolve os dados limpos, ou responde 400 e devolve null.
export function validar(schema, dados, res) {
  const resultado = schema.safeParse(dados ?? {});

  if (resultado.success) return resultado.data;

  const erros = resultado.error.issues.map((erro) => ({
    campo: erro.path.join(".") || null,
    mensagem: erro.message,
  }));

  res.status(400).json({ mensagem: erros[0].mensagem, erros });
  return null;
}

export function idDaRota(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ mensagem: "Identificador invalido." });
    return null;
  }

  return id;
}

export const proibido = (res, mensagem = "Voce nao tem permissao para esta acao.") =>
  res.status(403).json({ mensagem });

export const naoEncontrado = (res, mensagem) =>
  res.status(404).json({ mensagem });

export const conflito = (res, mensagem) =>
  res.status(409).json({ mensagem });

export const erroInterno = (res, erro) => {
  console.error(erro);
  return res.status(500).json({ mensagem: "Erro interno do servidor." });
};

// Erro de regra de negocio lancado dentro de transacoes: vira resposta HTTP.
export class ErroNegocio extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}
