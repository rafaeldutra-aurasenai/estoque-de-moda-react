import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/pedidos -> lista com contagem de itens e total
router.get('/', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT pe.id, pe.client_name, pe.client_email, pe.city, pe.freight, pe.status, pe.criado_em,
             COUNT(pi.id) AS items,
             COALESCE(SUM(pi.qty * pi.price), 0) + pe.freight AS total
      FROM pedidos pe
      LEFT JOIN pedido_itens pi ON pi.pedido_id = pe.id
      GROUP BY pe.id
      ORDER BY pe.criado_em DESC
    `);
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
});

// GET /api/pedidos/:id -> detalhe com itens
router.get('/:id', async (req, res) => {
  try {
    const [pedidos] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (pedidos.length === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });

    const [itens] = await pool.query(
      `SELECT pi.id, pi.sku, pi.variant, pi.qty, pi.price, p.name, p.emoji, p.color
       FROM pedido_itens pi JOIN produtos p ON p.sku = pi.sku
       WHERE pi.pedido_id = ?`,
      [req.params.id]
    );

    res.json({ ...pedidos[0], itens });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
});

// POST /api/pedidos -> cria pedido, valida e desconta estoque
router.post('/', async (req, res) => {
  const { client_name, client_email, city, freight, items } = req.body;

  if (!client_name || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ erro: 'Informe o cliente e ao menos um item' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // valida estoque de TODOS os itens antes de mexer em qualquer coisa
    for (const item of items) {
      const [produtos] = await conn.query('SELECT stock FROM produtos WHERE sku = ? FOR UPDATE', [item.sku]);
      if (produtos.length === 0) {
        await conn.rollback();
        return res.status(404).json({ erro: `Produto ${item.sku} não encontrado` });
      }
      if (produtos[0].stock < item.qty) {
        await conn.rollback();
        return res.status(400).json({ erro: `Estoque insuficiente para ${item.sku} (disponível: ${produtos[0].stock})` });
      }
    }

    const [resultadoPedido] = await conn.query(
      'INSERT INTO pedidos (client_name, client_email, city, freight, status) VALUES (?, ?, ?, ?, ?)',
      [client_name, client_email || null, city || null, freight || 0, 'Pendente']
    );
    const pedidoId = resultadoPedido.insertId;

    for (const item of items) {
      const [produtos] = await conn.query('SELECT price FROM produtos WHERE sku = ?', [item.sku]);
      const preco = produtos[0].price;

      await conn.query(
        'INSERT INTO pedido_itens (pedido_id, sku, variant, qty, price) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, item.sku, item.variant || null, item.qty, preco]
      );

      await conn.query('UPDATE produtos SET stock = stock - ? WHERE sku = ?', [item.qty, item.sku]);

      await conn.query(
        'INSERT INTO movimentacoes (sku, type, qty, reason) VALUES (?, ?, ?, ?)',
        [item.sku, 'out', item.qty, `Pedido #${pedidoId}`]
      );
    }

    await conn.commit();
    res.status(201).json({ id: pedidoId });
  } catch (erro) {
    await conn.rollback();
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar pedido' });
  } finally {
    conn.release();
  }
});

// PUT /api/pedidos/:id/status -> atualiza status (ex.: marcar como enviado)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validos = ['Pendente', 'Enviado', 'Entregue', 'Cancelado'];
  if (!validos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }
  try {
    await pool.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, req.params.id]);
    const [linhas] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (linhas.length === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
});

export default router;