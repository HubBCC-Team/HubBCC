import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const PASTA_ATUAL = path.dirname(fileURLToPath(import.meta.url));
export const PASTA_UPLOADS = path.resolve(
  PASTA_ATUAL,
  "..",
  "uploads",
  "comprovantes",
);

fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

const TIPOS_PERMITIDOS = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PASTA_UPLOADS),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

export const uploadComprovante = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (!TIPOS_PERMITIDOS.has(file.mimetype)) {
      return cb(new Error("Formato invalido. Envie PDF, PNG, JPG ou WEBP."));
    }
    cb(null, true);
  },
}).single("arquivo");

// Wrapper para devolver erros 400 limpos no formato { mensagem } do projeto
export function tratarUploadComprovante(req, res, next) {
  uploadComprovante(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ mensagem: "O comprovante deve ter no maximo 2 MB." });
    }
    return res
      .status(400)
      .json({ mensagem: err.message || "Erro ao enviar comprovante." });
  });
}
