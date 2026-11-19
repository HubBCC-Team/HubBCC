export function autorizarPerfis(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuario nao autenticado.",
      });
    }

    if (
      !perfisPermitidos.includes(
        req.usuario.perfil,
      )
    ) {
      return res.status(403).json({
        mensagem:
          "Voce nao tem permissao para esta acao.",
      });
    }

    next();
  };
}