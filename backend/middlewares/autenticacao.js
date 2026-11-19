import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export async function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      mensagem: "Token de autenticacao nao informado.",
    });
  }

  const [tipo, token] = authorization.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      mensagem: "Token de autenticacao invalido.",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    const usuarioId = Number(payload.sub);

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Usuario nao encontrado.",
      });
    }

    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    next();
  } catch {
    return res.status(401).json({
      mensagem:
        "Token invalido ou expirado.",
    });
  }
}