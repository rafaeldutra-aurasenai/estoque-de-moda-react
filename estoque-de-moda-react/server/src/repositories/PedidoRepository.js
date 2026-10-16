import { pool } from "../config/db.js";

const PedidoRepository = {
  async listarComTotais(lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         pe.id,
         pe.client_name,
         pe.client_email,
         pe.city,
         pe.freight,
         pe.status,
         pe.criado_em,
         COUNT(pi.id) AS items,
         COALESCE(
           SUM(pi.quantidade * pi.preco_unitario),
           0
         ) + pe.freight AS total
       FROM pedidos pe
       LEFT JOIN pedido_itens pi ON pi.pedido_id = pe.id
       WHERE pe.loja_id = ?
       GROUP BY
         pe.id,
         pe.client_name,
         pe.client_email,
         pe.city,
         pe.freight,
         pe.status,
         pe.criado_em
       ORDER BY pe.criado_em DESC`,
      [lojaId]
    );

    return linhas;
  },

  async buscarPorId(id, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT *
       FROM pedidos
       WHERE id = ? AND loja_id = ?
       LIMIT 1`,
      [id, lojaId]
    );

    return linhas[0] ?? null;
  },

  async buscarItens(pedidoId, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         pi.id,
         p.sku,
         pi.quantidade AS qty,
         pi.preco_unitario AS price,
         p.name,
         p.emoji,
         p.color
       FROM pedido_itens pi
       INNER JOIN pedidos pe
         ON pe.id = pi.pedido_id
        AND pe.loja_id = ?
       INNER JOIN produtos p
         ON p.id = pi.produto_id
        AND p.loja_id = pe.loja_id
       WHERE pi.pedido_id = ?`,
      [lojaId, pedidoId]
    );

    return linhas;
  },

  async criarPedido(
    { lojaId, client_name, client_email, city, freight, status },
    executor = pool
  ) {
    const [resultado] = await executor.query(
      `INSERT INTO pedidos
         (loja_id, client_name, client_email, city, freight, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        lojaId,
        client_name,
        client_email || null,
        city || null,
        Number(freight) || 0,
        status || "pendente",
      ]
    );

    return resultado.insertId;
  },

  async criarItem(
    { pedido_id, produto_id, quantidade, preco_unitario },
    executor = pool
  ) {
    await executor.query(
      `INSERT INTO pedido_itens
         (pedido_id, produto_id, quantidade, preco_unitario)
       VALUES (?, ?, ?, ?)`,
      [pedido_id, produto_id, quantidade, preco_unitario]
    );
  },

  async atualizarStatus(id, lojaId, status, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE pedidos
       SET status = ?
       WHERE id = ? AND loja_id = ?`,
      [status, id, lojaId]
    );

    return resultado.affectedRows > 0;
  },
};

export default PedidoRepository;