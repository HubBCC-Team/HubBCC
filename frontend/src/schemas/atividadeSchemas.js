/* ---------------------------------------------------------------------------
   schemas/atividadeSchemas.js
   SCHEMA ZOD da ATIVIDADE COMPLEMENTAR (casos de uso 19 e 20).
   Usado por RegistrarAtividade e EditarAtividade (FormularioAtividade).
--------------------------------------------------------------------------- */
import { z } from "zod";

export const CATEGORIAS_ATIVIDADE = ["Ensino", "Pesquisa", "Extensao", "Evento"];
export const TAMANHO_MAXIMO_COMPROVANTE = 2 * 1024 * 1024; // 2 MB

// Data de hoje em AAAA-MM-DD no fuso local.
function hojeLocalISO() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

export const atividadeSchema = z.object({
  categoria: z.enum(CATEGORIAS_ATIVIDADE, { error: "Selecione a categoria." }),
  titulo: z
    .string()
    .trim()
    .min(1, "Informe o nome da atividade.")
    .min(3, "Nome muito curto.")
    .max(120, "Maximo de 120 caracteres."),
  data: z
    .string()
    .min(1, "Informe a data de conclusao.")
    .refine((data) => data <= hojeLocalISO(), "A data de conclusao nao pode ser futura."),
  horas: z.coerce
    .number({ error: "Informe a carga horaria." })
    .min(1, "Minimo de 1 hora.")
    .max(200, "Maximo de 200 horas por atividade."),
  descricao: z.string().trim().max(500, "Maximo de 500 caracteres.").optional().default(""),
  // Nome do arquivo (obrigatorio) + conteudo em base64 (para o visualizador).
  comprovante: z.string().min(1, "Anexe o comprovante da atividade."),
  comprovanteArquivo: z.string().optional().default(""),
});
