import { pool } from '../config/db.js';

const PedidoRepository = {
  async listarComTotais(executor = pool) {
    const [linhas] = await executor.query(`
      SELECT pe.id, pe.client_name, pe.client_email, pe.city, pe.freight, pe.status, pe.criado_em,
             COUNT(pi.id) AS items,
             COALESCE(SUM(pi.qty * pi.price), 0) + pe.freight AS total
      FROM pedidos pe
      LEFT JOIN pedido_itens pi ON pi.pedido_id = pe.id
      GROUP BY pe.id
      ORDER BY pe.criado_em DESC
    `);
    return linhas;
  },

  async buscarPorId(id, executor = pool) {
    const [linhas] = await executor.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    return linhas[0] ?? null;
  },

  async buscarItens(pedidoId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT pi.id, pi.sku, pi.variant, pi.qty, pi.price, p.name, p.emoji, p.color
       FROM pedido_itens pi JOIN produtos p ON p.sku = pi.sku
       WHERE pi.pedido_id = ?`,
      [pedidoId]
    );
    return linhas;
  },

  async criarPedido({ client_name, client_email, city, freight, status }, executor = pool) {
    const [resultado] = await executor.query(
      'INSERT INTO pedidos (client_name, client_email, city, freight, status) VALUES (?, ?, ?, ?, ?)',
      [client_name, client_email || null, city || null, freight || 0, status]
    );
    return resultado.insertId;
  },

  async criarItem({ pedido_id, sku, variant, qty, price }, executor = pool) {
    await executor.query(
      'INSERT INTO pedido_itens (pedido_id, sku, variant, qty, price) VALUES (?, ?, ?, ?, ?)',
      [pedido_id, sku, variant || null, qty, price]
    );
  },

  async atualizarStatus(id, status, executor = pool) {
    await executor.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);
  },
};

export default PedidoRepository;
