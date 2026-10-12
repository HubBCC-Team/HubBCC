/* ---------------------------------------------------------------------------
   schemas/apoioSchemas.js
   SCHEMA ZOD da OFERTA DE APOIO (monitoria/tutoria) - casos de uso 9 e 12.

   Usado pelo FormularioOferta (criar e editar) via zodResolver.
   Alem de validar, o Zod TRANSFORMA os dados antes do envio:
   - disciplinaId e vagas viram numero (o <select>/<input> entregam texto);
   - se a oferta for gratuita, o valor vira 0.
--------------------------------------------------------------------------- */
import { z } from "zod";

export const TIPOS_OFERTA = ["Monitoria", "Tutoria"];
export const MODALIDADES_OFERTA = ["Presencial", "Remoto", "Hibrido"];

// Um horario marcado na GradeHorarios: { id: "Segunda-14:00", dia, inicio, fim }
const horarioSchema = z.object({
  id: z.union([z.string(), z.number()]),
  dia: z.string(),
  inicio: z.string(),
  fim: z.string(),
});

export const ofertaSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(1, "Informe o titulo.")
      .min(5, "O titulo deve ter pelo menos 5 caracteres.")
      .max(100, "Maximo de 100 caracteres."),
    disciplinaId: z.coerce
      .number({ error: "Selecione a disciplina." })
      .int()
      .positive("Selecione a disciplina."),
    tipo: z.enum(TIPOS_OFERTA, { error: "Selecione o tipo." }),
    assunto: z
      .string()
      .trim()
      .min(1, "Informe os assuntos abordados.")
      .min(3, "Descreva melhor os assuntos.")
      .max(150, "Maximo de 150 caracteres."),
    modalidade: z.enum(MODALIDADES_OFERTA, { error: "Selecione a modalidade." }),
    local: z.string().trim().min(1, "Informe o local ou o link do atendimento.").max(120, "Maximo de 120 caracteres."),
    vagas: z.coerce
      .number({ error: "Informe a quantidade de vagas." })
      .int("Use um numero inteiro.")
      .min(1, "Minimo de 1 vaga.")
      .max(50, "Maximo de 50 vagas."),
    gratuita: z.boolean(),
    valor: z.coerce.number({ error: "Informe um valor valido." }).min(0, "O valor nao pode ser negativo.").max(1000, "Valor muito alto."),
    descricao: z.string().trim().max(1000, "Maximo de 1000 caracteres.").optional().default(""),
    horarios: z.array(horarioSchema).min(1, "Selecione ao menos um horario de atendimento."),
  })
  // Oferta paga precisa ter valor maior que zero.
  .refine((dados) => dados.gratuita || dados.valor > 0, {
    message: "Informe o valor por atendimento.",
    path: ["valor"],
  })
  // Oferta gratuita sempre grava valor 0.
  .transform((dados) => ({ ...dados, valor: dados.gratuita ? 0 : dados.valor }));
