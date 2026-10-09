
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { pool } from "../config/db.js";
import autenticarToken from "../middlewares/authMiddleware.js";

const router = Router();

function gerarCodigoLoja() {
  return crypto.randomBytes(5).toString("hex").toUpperCase();
}

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      papel: usuario.papel,
      loja_id: usuario.loja_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
}

router.post("/registro", async (req, res) => {
  const {
    nome,
    sobrenome,
    empresa,
    email,
    senha,
    papel,
    codigo_loja,
  } = req.body;

  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios.",
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({
      mensagem: "A senha precisa ter pelo menos 6 caracteres.",
    });
  }

  if (!["dono", "funcionario"].includes(papel)) {
    return res.status(400).json({
      mensagem: "Tipo de usuário inválido.",
    });
  }

  const emailNormalizado = email.trim().toLowerCase();
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [usuariosExistentes] = await conexao.query(
      `
      SELECT id
      FROM usuarios
      WHERE email = ?
      LIMIT 1
      `,
      [emailNormalizado]
    );

    if (usuariosExistentes.length > 0) {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    let lojaId;
    let codigoGerado = null;

    if (papel === "dono") {
      const nomeLoja = empresa?.trim() || "Minha Loja";

      codigoGerado = gerarCodigoLoja();

      const [resultadoLoja] = await conexao.query(
        `
        INSERT INTO lojas (
          nome,
          codigo_acesso
        )
        VALUES (?, ?)
        `,
        [nomeLoja, codigoGerado]
      );

      lojaId = resultadoLoja.insertId;

      await conexao.query(
        `
        INSERT INTO configuracoes (
          loja_id,
          nome_marca
        )
        VALUES (?, ?)
        `,
        [lojaId, nomeLoja]
      );
    }

    if (papel === "funcionario") {
      if (!codigo_loja) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem: "O funcionário precisa informar o código da loja.",
        });
      }

      const [lojas] = await conexao.query(
        `
        SELECT id
        FROM lojas
        WHERE codigo_acesso = ?
        LIMIT 1
        `,
        [codigo_loja.trim().toUpperCase()]
      );

      if (lojas.length === 0) {
        await conexao.rollback();

        return res.status(404).json({
          mensagem: "Código da loja não encontrado.",
        });
      }

      lojaId = lojas[0].id;
    }

    const [resultadoUsuario] = await conexao.query(
      `
      INSERT INTO usuarios (
        loja_id,
        nome,
        sobrenome,
        email,
        empresa,
        senha,
        papel
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        lojaId,
        nome.trim(),
        sobrenome?.trim() || null,
        emailNormalizado,
        empresa?.trim() || null,
        senhaHash,
        papel,
      ]
    );

    const usuario = {
      id: resultadoUsuario.insertId,
      loja_id: lojaId,
      nome: nome.trim(),
      sobrenome: sobrenome?.trim() || null,
      email: emailNormalizado,
      papel,
      empresa: empresa?.trim() || null,
    };

    const token = gerarToken(usuario);

    await conexao.commit();

    return res.status(201).json({
      mensagem:
        papel === "dono"
          ? "Loja criada com sucesso!"
          : "Você entrou na loja com sucesso!",
      token,
      usuario,
      ...(papel === "dono"
        ? {
            codigo_loja: codigoGerado,
          }
        : {}),
    });
  } catch (erro) {
    await conexao.rollback();

    console.error("Erro no registro:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao criar a conta.",
    });
  } finally {
    conexao.release();
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Informe o e-mail e a senha.",
    });
  }

  try {
    const emailNormalizado = email.trim().toLowerCase();

    const [usuarios] = await pool.query(
      `
      SELECT
        id,
        loja_id,
        nome,
        sobrenome,
        email,
        empresa,
        senha,
        papel
      FROM usuarios
      WHERE email = ?
      LIMIT 1
      `,
      [emailNormalizado]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const usuarioBanco = usuarios[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuarioBanco.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const usuario = {
      id: usuarioBanco.id,
      loja_id: usuarioBanco.loja_id,
      nome: usuarioBanco.nome,
      sobrenome: usuarioBanco.sobrenome,
      email: usuarioBanco.email,
      empresa: usuarioBanco.empresa,
      papel: usuarioBanco.papel,
    };

    const token = gerarToken(usuario);

    return res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario,
    });
  } catch (erro) {
    console.error("Erro no login:", erro);

    return res.status(500).json({
      mensagem: "Erro interno no login.",
    });
  }
});

router.get(
  "/me",
  autenticarToken,
  async (req, res) => {
    try {
      const [usuarios] = await pool.query(
        `
        SELECT
          id,
          loja_id,
          nome,
          sobrenome,
          email,
          empresa,
          papel
        FROM usuarios
        WHERE id = ?
        LIMIT 1
        `,
        [req.usuario.id]
      );

      if (usuarios.length === 0) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado.",
        });
      }

      res.json({
        usuario: usuarios[0],
      });
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem: "Erro ao buscar usuário.",
      });
    }
  }
);

router.get(
  "/minha-loja",
  autenticarToken,
  async (req, res) => {
    try {
      const [lojas] = await pool.query(
        `
        SELECT
          id,
          nome,
          codigo_acesso,
          criado_em
        FROM lojas
        WHERE id = ?
        LIMIT 1
        `,
        [req.usuario.loja_id]
      );

      if (lojas.length === 0) {
        return res.status(404).json({
          mensagem: "Loja não encontrada.",
        });
      }

      res.json({
        loja: lojas[0],
      });
    } catch (erro) {
      console.error(erro);

      res.status(500).json({
        mensagem: "Erro ao buscar loja.",
      });
    }
  }
);

export default router;

