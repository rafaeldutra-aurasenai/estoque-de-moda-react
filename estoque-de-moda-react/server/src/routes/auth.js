const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database'); // Conexão com o MySQL feita na Etapa 2

// 📝 ROTA 1: Registro de Usuário
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
    }

    // 1. Verificar se o e-mail já está cadastrado
    const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length > 0) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }

    // 2. Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Salvar o novo usuário no banco
    await db.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (erro) {
    console.error('Erro no registro:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// 🔑 ROTA 2: Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe o e-mail e a senha.' });
    }

    // 1. Buscar o usuário pelo e-mail
    const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = usuarios[0];

    // 2. Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // 3. Gerar o Token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 4. Retornar o token e os dados públicos do usuário
    res.json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

module.exports = router;