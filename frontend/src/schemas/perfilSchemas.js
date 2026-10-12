/* ---------------------------------------------------------------------------
   schemas/perfilSchemas.js
   SCHEMA ZOD da edicao de contato na tela de Perfil.
--------------------------------------------------------------------------- */
import { z } from "zod";

export const contatoSchema = z.object({
  telefone: z
    .string()
    .trim()
    .refine(
      (t) => t === "" || /^\d{10,11}$/.test(t.replace(/\D/g, "")),
      "Telefone invalido. Use DDD + numero, ex.: (21) 90000-0000."
    ),
});
