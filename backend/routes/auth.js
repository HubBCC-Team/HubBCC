import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { prisma } from "../lib/prisma.js";
import { autenticar } from "../middlewares/autenticacao.js";
import {
  cadastroSchema,
  loginSchema,
} from "../schemas/authSchema.js";

const router = express.Router();

/* ------------------------------- AUXILIARES ------------------------------ */

function validar(schema, dados, res) {
  const resultado = schema.safeParse(dados ?? {});

  if (resultado.success) {
    return resultado.data;
  }

  const erros = resultado.error.issues.map((erro) => ({
    campo: erro.path.join(".") || null,
    mensagem: erro.message,
  }));

  res.status(400).json({
    mensagem: erros[0].mensagem,
    erros,
  });

  return null;
}

function iniciaisDe(nome = "") {
  const partes = String(nome)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!partes.length) {
    return "";
  }

  if (partes.length === 1) {
    return partes[0][0].toUpperCase();
  }

  return (
    partes[0][0] +
    partes[partes.length - 1][0]
  ).toUpperCase();
}

function usuarioSemSenha(usuario) {
  const {
    senhaHash,
    refreshTokenHash,
    ...dados
  } = usuario;

  return dados;
}

function gerarAccessToken(usuario) {
  return jwt.sign(
    {
      perfil: usuario.perfil,
      tipo: "access",
    },
    process.env.JWT_SECRET,
    {
      subject: String(usuario.id),
      expiresIn:
        process.env.JWT_EXPIRES_IN || "1h",
    },
  );
}

function gerarRefreshToken(usuario) {
  return jwt.sign(
    {
      tipo: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      subject: String(usuario.id),
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || "7d",

      // Garante que cada refresh token seja unico,
      // mesmo quando dois sao gerados no mesmo segundo.
      jwtid: crypto.randomUUID(),
    },
  );
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

async function gerarSessao(usuario) {
  const token = gerarAccessToken(usuario);
  const refreshToken =
    gerarRefreshToken(usuario);

  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },
    data: {
      refreshTokenHash:
        hashToken(refreshToken),
    },
  });

  return {
    token,
    refreshToken,
  };
}

/* -------------------------------- CADASTRO ------------------------------- */

// POST /auth/cadastro
router.post("/cadastro", async (req, res) => {
  const dados = validar(
    cadastroSchema,
    req.body,
    res,
  );

  if (!dados) return;

  try {
    const emailExistente =
      await prisma.usuario.findUnique({
        where: {
          email: dados.email,
        },
      });

    if (emailExistente) {
      return res.status(409).json({
        mensagem:
          "Ja existe uma conta com este e-mail.",
      });
    }

    const matriculaExistente =
      await prisma.usuario.findUnique({
        where: {
          matricula: dados.matricula,
        },
      });

    if (matriculaExistente) {
      return res.status(409).json({
        mensagem:
          "Ja existe uma conta com esta matricula.",
      });
    }

    const senhaHash = await bcrypt.hash(
      dados.senha,
      12,
    );

    const usuario =
      await prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senhaHash,

          perfil: "aluno",

          matricula: dados.matricula,
          periodo: dados.periodo,
          telefone: dados.telefone,

          curso:
            "Bacharelado em Ciencia da Computacao",

          iniciais: iniciaisDe(dados.nome),
        },
      });

    const sessao =
      await gerarSessao(usuario);

    res.status(201).json({
      ...sessao,
      usuario:
        usuarioSemSenha(usuario),
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao cadastrar usuario.",
    });
  }
});

/* ---------------------------------- LOGIN -------------------------------- */

// POST /auth/login
router.post("/login", async (req, res) => {
  const dados = validar(
    loginSchema,
    req.body,
    res,
  );

  if (!dados) return;

  try {
    const usuario =
      await prisma.usuario.findUnique({
        where: {
          email: dados.email,
        },
      });

    if (!usuario) {
      return res.status(401).json({
        mensagem:
          "E-mail ou senha invalidos.",
      });
    }

    const senhaCorreta =
      await bcrypt.compare(
        dados.senha,
        usuario.senhaHash,
      );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem:
          "E-mail ou senha invalidos.",
      });
    }

    const sessao =
      await gerarSessao(usuario);

    res.json({
      ...sessao,
      usuario:
        usuarioSemSenha(usuario),
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem:
        "Erro ao realizar login.",
    });
  }
});

/* ------------------------------ REFRESH TOKEN ---------------------------- */

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  const refreshToken =
    req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      mensagem:
        "Refresh token nao informado.",
    });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    if (
      typeof payload !== "object" ||
      payload.tipo !== "refresh"
    ) {
      return res.status(401).json({
        mensagem:
          "Refresh token invalido.",
      });
    }

    const usuarioId =
      Number(payload.sub);

    if (
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0
    ) {
      return res.status(401).json({
        mensagem:
          "Refresh token invalido.",
      });
    }

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: usuarioId,
        },
      });

    if (
      !usuario ||
      !usuario.refreshTokenHash
    ) {
      return res.status(401).json({
        mensagem:
          "Refresh token invalido.",
      });
    }

    const hashRecebido =
      hashToken(refreshToken);

    if (
      hashRecebido !==
      usuario.refreshTokenHash
    ) {
      return res.status(401).json({
        mensagem:
          "Refresh token invalido.",
      });
    }

    const sessao =
      await gerarSessao(usuario);

    res.json(sessao);
  } catch {
    return res.status(401).json({
      mensagem:
        "Refresh token invalido ou expirado.",
    });
  }
});

/* -------------------------------- LOGOUT --------------------------------- */

// POST /auth/logout
router.post(
  "/logout",
  autenticar,
  async (req, res) => {
    try {
      await prisma.usuario.update({
        where: {
          id: req.usuario.id,
        },
        data: {
          refreshTokenHash: null,
        },
      });

      res.status(204).send();
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem:
          "Erro ao encerrar sessao.",
      });
    }
  },
);

/* ----------------------------- ROTA PROTEGIDA ---------------------------- */

// GET /auth/me
router.get(
  "/me",
  autenticar,
  (req, res) => {
    res.json({
      usuario: req.usuario,
    });
  },
);

export default router;