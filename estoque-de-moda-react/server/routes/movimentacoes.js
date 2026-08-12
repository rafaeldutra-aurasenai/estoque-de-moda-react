import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/movimentacoes -> histórico (mais recentes primeiro)
router.get('/', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT m.id, m.sku, m.type, m.qty, m.reason, m.criado_em,
             p.name AS product_name, p.emoji, p.color
      FROM movimentacoes m
      JOIN produtos p ON p.sku = m.sku
      ORDER BY m.criado_em DESC
      LIMIT 50
    `);
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar movimentações' });
  }
});

// POST /api/movimentacoes -> registra a movimentação e ajusta o estoque
router.post('/', async (req, res) => {
  const { sku, type, qty, reason } = req.body;

  if (!sku || !type || !qty || qty <= 0) {
    return res.status(400).json({ erro: 'Informe produto, tipo e uma quantidade válida' });
  }
  if (type !== 'in' && type !== 'out') {
    return res.status(400).json({ erro: "Tipo deve ser 'in' ou 'out'" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [produtos] = await conn.query('SELECT stock FROM produtos WHERE sku = ? FOR UPDATE', [sku]);
    if (produtos.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const estoqueAtual = produtos[0].stock;
    if (type === 'out' && estoqueAtual < qty) {
      await conn.rollback();
      return res.status(400).json({ erro: `Estoque insuficiente (disponível: ${estoqueAtual})` });
    }

    const novoEstoque = type === 'in' ? estoqueAtual + Number(qty) : estoqueAtual - Number(qty);
    await conn.query('UPDATE produtos SET stock = ? WHERE sku = ?', [novoEstoque, sku]);

    const [resultado] = await conn.query(
      'INSERT INTO movimentacoes (sku, type, qty, reason) VALUES (?, ?, ?, ?)',
      [sku, type, qty, reason || null]
    );

    await conn.commit();

    const [linhas] = await pool.query(
      `SELECT m.id, m.sku, m.type, m.qty, m.reason, m.criado_em, p.name AS product_name, p.emoji, p.color
       FROM movimentacoes m JOIN produtos p ON p.sku = m.sku WHERE m.id = ?`,
      [resultado.insertId]
    );
    res.status(201).json(linhas[0]);
  } catch (erro) {
    await conn.rollback();
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar movimentação' });
  } finally {
    conn.release();
  }
});

export default router;