/* ---------------------------------------------------------------------------
   schemas/oportunidadeSchemas.js
   SCHEMAS ZOD de OPORTUNIDADES e CANDIDATURAS.

   Um schema descreve as regras de cada campo (obrigatorio, tamanho minimo,
   numero, data...). O React Hook Form usa o schema pelo zodResolver: antes de
   enviar, o Zod valida tudo e devolve as mensagens que aparecem embaixo de
   cada campo. Se estiver tudo certo, o Zod tambem TRANSFORMA os dados
   (ex.: texto de requisitos vira array) antes de chegarem ao aoSalvar.
--------------------------------------------------------------------------- */
import { z } from "zod";

export const TIPOS_OPORTUNIDADE = ["Iniciacao Cientifica", "Extensao", "Evento", "Estagio", "Monitoria"];
export const MODALIDADES = ["Presencial", "Remoto", "Hibrido"];

// Data de hoje no formato do <input type="date"> (AAAA-MM-DD), no fuso local.
function hojeISO() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

// Texto com uma linha por item -> array, ignorando linhas vazias.
const listaPorLinha = z
  .string()
  .optional()
  .default("")
  .transform((texto) =>
    texto
      .split("\n")
      .map((linha) => linha.trim())
      .filter(Boolean)
  );

const textoObrigatorio = (nome, minimo = 2) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${nome}.`)
    .min(minimo, `${nome[0].toUpperCase() + nome.slice(1)} muito curto(a).`);

/* ------------------------------ OPORTUNIDADE ------------------------------ */

// Regras comuns a cadastro e edicao.
export const oportunidadeSchema = z.object({
  titulo: z.string().trim().min(1, "Informe o titulo.").min(5, "O titulo deve ter pelo menos 5 caracteres.").max(120, "Maximo de 120 caracteres."),
  tipo: z.enum(TIPOS_OPORTUNIDADE, { error: "Selecione o tipo." }),
  area: textoObrigatorio("a area"),
  departamento: textoObrigatorio("o departamento"),
  responsavel: textoObrigatorio("o responsavel", 3),
  modalidade: z.enum(MODALIDADES, { error: "Selecione a modalidade." }),
  local: textoObrigatorio("o local"),
  bolsa: z.string().trim().max(60, "Maximo de 60 caracteres.").optional().default(""),
  cargaHoraria: z.string().trim().max(40, "Maximo de 40 caracteres.").optional().default(""),
  // coerce: o <input type="number"> entrega texto; o Zod converte para numero.
  vagas: z.coerce
    .number({ error: "Informe a quantidade de vagas." })
    .int("Use um numero inteiro.")
    .min(1, "Minimo de 1 vaga.")
    .max(500, "Maximo de 500 vagas."),
  prazoInscricao: z.string().min(1, "Informe o prazo de inscricao."),
  descricao: z.string().trim().min(1, "Informe a descricao.").min(20, "Descreva com pelo menos 20 caracteres.").max(2000, "Maximo de 2000 caracteres."),
  requisitos: listaPorLinha,
  atividades: listaPorLinha,
});

// No CADASTRO o prazo nao pode estar no passado.
// (Na edicao isso nao e exigido, para permitir editar oportunidades antigas.)
export const cadastroOportunidadeSchema = oportunidadeSchema.refine(
  (dados) => dados.prazoInscricao >= hojeISO(),
  { message: "O prazo nao pode ser uma data passada.", path: ["prazoInscricao"] }
);

/* ------------------------------- CANDIDATURA ------------------------------ */

export const CARTA_MINIMO = 30;
export const CARTA_MAXIMO = 2000;

export const candidaturaSchema = z.object({
  carta: z
    .string()
    .trim()
    .min(1, "Escreva sua carta de motivacao.")
    .min(CARTA_MINIMO, `A carta deve ter pelo menos ${CARTA_MINIMO} caracteres.`)
    .max(CARTA_MAXIMO, `A carta deve ter no maximo ${CARTA_MAXIMO} caracteres.`),
});
