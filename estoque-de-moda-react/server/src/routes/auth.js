import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import autenticarToken from "../middlewares/authMiddleware.js";

const router = Router();

function gerarToken(usuario) {
return jwt.sign(
{
id: usuario.id,
email: usuario.email,
nome: usuario.nome,
papel: usuario.papel,
},
process.env.JWT_SECRET,
{
expiresIn: "8h",
}
);
}

function usuarioPublico(usuario) {
return {
id: usuario.id,
nome: usuario.nome,
sobrenome: usuario.sobrenome,
email: usuario.email,
papel: usuario.papel,
};
}

// =====================================================
// CRIAR CONTA
// POST /api/auth/registro
// =====================================================

router.post("/registro", async (req, res) => {
try {


const {
  nome,
  sobrenome,
  empresa,
  email,
  senha,
} = req.body;

if (!nome || !email || !senha) {
  return res.status(400).json({
    mensagem:
      "Nome, e-mail e senha são obrigatórios.",
  });
}

if (senha.length < 6) {
  return res.status(400).json({
    mensagem:
      "A senha deve ter pelo menos 6 caracteres.",
  });
}

const emailNormalizado =
  email.trim().toLowerCase();

// Verifica se já existe
const [existentes] =
  await pool.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [emailNormalizado]
  );

if (existentes.length > 0) {
  return res.status(409).json({
    mensagem:
      "Este e-mail já está cadastrado.",
  });
}

// Criptografa a senha
const senhaHash =
  await bcrypt.hash(senha, 10);

// Cria usuário
const [resultado] =
  await pool.query(
    `INSERT INTO usuarios
    (
      nome,
      sobrenome,
      email,
      empresa,
      senha,
      papel
    )
    VALUES (?, ?, ?, ?, ?, 'cliente')`,
    [
      nome.trim(),
      sobrenome?.trim() || null,
      emailNormalizado,
      empresa?.trim() || null,
      senhaHash,
    ]
  );

const usuarioId =
  resultado.insertId;

// Cria configurações do usuário
await pool.query(
  `INSERT INTO configuracoes
  (
    usuario_id,
    nome_marca
  )
  VALUES (?, ?)`,
  [
    usuarioId,
    empresa?.trim() ||
      "Minha Loja",
  ]
);

// Busca usuário criado
const [linhas] =
  await pool.query(
    `SELECT
      id,
      nome,
      sobrenome,
      email,
      papel
    FROM usuarios
    WHERE id = ?`,
    [usuarioId]
  );

const usuario =
  linhas[0];

// Cria JWT
const token =
  gerarToken(usuario);

return res.status(201).json({
  mensagem:
    "Conta criada com sucesso!",

  token,

  usuario:
    usuarioPublico(usuario),
});


} catch (erro) {


console.error(
  "Erro no registro:",
  erro
);

return res.status(500).json({
  mensagem:
    "Erro interno ao criar a conta.",
});


}
});

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
try {


const {
  email,
  senha,
} = req.body;

if (!email || !senha) {
  return res.status(400).json({
    mensagem:
      "Informe o e-mail e a senha.",
  });
}

const emailNormalizado =
  email.trim().toLowerCase();

const [linhas] =
  await pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [emailNormalizado]
  );

if (linhas.length === 0) {
  return res.status(401).json({
    mensagem:
      "E-mail ou senha incorretos.",
  });
}

const usuario =
  linhas[0];

// Compara senha digitada
// com hash armazenado
const senhaCorreta =
  await bcrypt.compare(
    senha,
    usuario.senha
  );

if (!senhaCorreta) {
  return res.status(401).json({
    mensagem:
      "E-mail ou senha incorretos.",
  });
}

// Gera JWT
const token =
  gerarToken(usuario);

return res.json({
  mensagem:
    "Login realizado com sucesso!",

  token,

  usuario:
    usuarioPublico(usuario),
});


} catch (erro) {


console.error(
  "Erro no login:",
  erro
);

return res.status(500).json({
  mensagem:
    "Erro interno ao realizar login.",
});


}
});

// =====================================================
// USUÁRIO LOGADO
// GET /api/auth/me
// =====================================================

router.get(
"/me",
autenticarToken,
async (req, res) => {


try {

  const [linhas] =
    await pool.query(
      `SELECT
        id,
        nome,
        sobrenome,
        email,
        papel
      FROM usuarios
      WHERE id = ?`,
      [req.usuario.id]
    );

  if (linhas.length === 0) {
    return res.status(404).json({
      mensagem:
        "Usuário não encontrado.",
    });
  }

  return res.json({
    usuario:
      usuarioPublico(linhas[0]),
  });

} catch (erro) {

  console.error(
    "Erro ao buscar usuário:",
    erro
  );

  return res.status(500).json({
    mensagem:
      "Erro interno no servidor.",
  });
}


}
);

export default router;
