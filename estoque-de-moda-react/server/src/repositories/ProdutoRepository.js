
import { pool } from "../config/db.js";

const ProdutoRepository = {
  async listarTodos(lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT * FROM produtos
       WHERE loja_id = ?
       ORDER BY criado_em DESC`,
      [lojaId]
    );
    return linhas;
  },

  async buscarPorSku(sku, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT * FROM produtos
       WHERE sku = ? AND loja_id = ?
       LIMIT 1`,
      [sku, lojaId]
    );
    return linhas[0] ?? null;
  },

  async buscarEstoqueComLock(sku, lojaId, conn) {
    const [linhas] = await conn.query(
      `SELECT id, stock FROM produtos
       WHERE sku = ? AND loja_id = ?
       FOR UPDATE`,
      [sku, lojaId]
    );
    return linhas[0] ?? null;
  },

  async criar(dados, lojaId, executor = pool) {
    const {
      sku, name, cat, price, stock, min,
      supplier, location, colors, sizes, desc, emoji, color,
    } = dados;

    await executor.query(
      `INSERT INTO produtos
       (loja_id, sku, name, cat, price, stock, min_stock,
        emoji, color, supplier, location, entry_date,
        colors, sizes, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      [
        lojaId,
        sku,
        name,
        cat,
        Number(price) || 0,
        Number(stock) || 0,
        Number(min) || 0,
        emoji || "👗",
        color || "#EFEAE2",
        supplier || null,
        location || null,
        JSON.stringify(colors || []),
        JSON.stringify(sizes || []),
        desc || null,
      ]
    );
  },

  async atualizar(sku, lojaId, dados, executor = pool) {
    const {
      name, cat, price, stock, min,
      supplier, location, colors, sizes, desc,
    } = dados;

    const [resultado] = await executor.query(
      `UPDATE produtos
       SET name = ?, cat = ?, price = ?, stock = ?,
           min_stock = ?, supplier = ?, location = ?,
           colors = ?, sizes = ?, descricao = ?
       WHERE sku = ? AND loja_id = ?`,
      [
        name,
        cat,
        Number(price) || 0,
        Number(stock) || 0,
        Number(min) || 0,
        supplier || null,
        location || null,
        JSON.stringify(colors || []),
        JSON.stringify(sizes || []),
        desc || null,
        sku,
        lojaId,
      ]
    );

    return resultado.affectedRows > 0;
  },

  async atualizarEstoque(sku, lojaId, novoEstoque, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE produtos SET stock = ?
       WHERE sku = ? AND loja_id = ?`,
      [novoEstoque, sku, lojaId]
    );
    return resultado.affectedRows > 0;
  },

  async ajustarEstoque(sku, lojaId, delta, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE produtos SET stock = stock + ?
       WHERE sku = ? AND loja_id = ?`,
      [delta, sku, lojaId]
    );
    return resultado.affectedRows > 0;
  },

  async remover(sku, lojaId, executor = pool) {
    const [resultado] = await executor.query(
      `DELETE FROM produtos
       WHERE sku = ? AND loja_id = ?`,
      [sku, lojaId]
    );
    return resultado.affectedRows > 0;
  },
};

export default ProdutoRepository;