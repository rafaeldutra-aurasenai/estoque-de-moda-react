
import jwt from "jsonwebtoken";

export default function autenticarToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem: "Faça login para acessar esta página.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      mensagem: "O servidor não está configurado corretamente.",
    });
  }

  try {
    const token = authorization.slice(7);

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id || !payload.loja_id) {
      return res.status(401).json({
        mensagem: "A sessão não contém os dados necessários.",
      });
    }

    req.usuario = {
      id: payload.id,
      loja_id: payload.loja_id,
      email: payload.email,
      nome: payload.nome,
      papel: payload.papel,
    };

    next();
  } catch {
    return res.status(401).json({
      mensagem: "Sua sessão expirou. Entre novamente.",
    });
  }
}