import { pool } from '../config/db.js';

const MovimentacaoRepository = {
  async listarRecentes(limite, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT m.id, m.sku, m.type, m.qty, m.reason, m.criado_em,
              p.name AS product_name, p.emoji, p.color
       FROM movimentacoes m
       JOIN produtos p ON p.sku = m.sku
       ORDER BY m.criado_em DESC
       LIMIT ?`,
      [limite]
    );
    return linhas;
  },

  async buscarPorId(id, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT m.id, m.sku, m.type, m.qty, m.reason, m.criado_em, p.name AS product_name, p.emoji, p.color
       FROM movimentacoes m JOIN produtos p ON p.sku = m.sku WHERE m.id = ?`,
      [id]
    );
    return linhas[0] ?? null;
  },

  async criar({ sku, type, qty, reason }, executor = pool) {
    const [resultado] = await executor.query(
      'INSERT INTO movimentacoes (sku, type, qty, reason) VALUES (?, ?, ?, ?)',
      [sku, type, qty, reason || null]
    );
    return resultado.insertId;
  },
};

export default MovimentacaoRepository;
