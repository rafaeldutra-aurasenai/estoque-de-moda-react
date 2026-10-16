import { pool } from "../config/db.js";

const MovimentacaoRepository = {
  async listarRecentes(lojaId, limite = 50, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         m.id,
         p.sku,
         CASE WHEN m.tipo = 'entrada' THEN 'in' ELSE 'out' END AS type,
         m.quantidade AS qty,
         m.observacao AS reason,
         m.criado_em,
         p.name AS product_name,
         p.emoji,
         p.color
       FROM movimentacoes m
       INNER JOIN produtos p
         ON p.id = m.produto_id
        AND p.loja_id = m.loja_id
       WHERE m.loja_id = ?
       ORDER BY m.criado_em DESC
       LIMIT ?`,
      [lojaId, Number(limite)]
    );

    return linhas;
  },

  async buscarPorId(id, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         m.id,
         p.sku,
         CASE WHEN m.tipo = 'entrada' THEN 'in' ELSE 'out' END AS type,
         m.quantidade AS qty,
         m.observacao AS reason,
         m.criado_em,
         p.name AS product_name,
         p.emoji,
         p.color
       FROM movimentacoes m
       INNER JOIN produtos p
         ON p.id = m.produto_id
        AND p.loja_id = m.loja_id
       WHERE m.id = ? AND m.loja_id = ?
       LIMIT 1`,
      [id, lojaId]
    );

    return linhas[0] ?? null;
  },

  async criar(
    { lojaId, produtoId, usuarioId, type, qty, reason },
    executor = pool
  ) {
    const tipo = type === "in" ? "entrada" : "saida";

    const [resultado] = await executor.query(
      `INSERT INTO movimentacoes
         (loja_id, produto_id, usuario_id, tipo, quantidade, observacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        lojaId,
        produtoId,
        usuarioId,
        tipo,
        Number(qty),
        reason || null,
      ]
    );

    return resultado.insertId;
  },
};

export default MovimentacaoRepository;