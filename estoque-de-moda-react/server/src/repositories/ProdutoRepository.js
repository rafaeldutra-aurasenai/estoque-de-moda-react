import { pool } from '../config/db.js';

// Toda função aceita um "executor" opcional (pool ou uma conexão de
// transação). Por padrão usa o pool; quando um service precisa que
// várias queries façam parte da mesma transação, ele passa a conexão.
const ProdutoRepository = {
  async listarTodos(executor = pool) {
    const [linhas] = await executor.query('SELECT * FROM produtos ORDER BY criado_em DESC');
    return linhas;
  },

  async buscarPorSku(sku, executor = pool) {
    const [linhas] = await executor.query('SELECT * FROM produtos WHERE sku = ?', [sku]);
    return linhas[0] ?? null;
  },

  // Busca o estoque travando a linha (FOR UPDATE) — só faz sentido
  // dentro de uma transação, por isso exige a conexão explicitamente.
  async buscarEstoqueComLock(sku, conn) {
    const [linhas] = await conn.query('SELECT stock FROM produtos WHERE sku = ? FOR UPDATE', [sku]);
    return linhas[0] ?? null;
  },

  async criar(dados, executor = pool) {
    const {
      sku, name, cat, price, stock, min, supplier, location, colors, sizes, desc, emoji, color,
    } = dados;

    await executor.query(
      `INSERT INTO produtos (sku, name, cat, price, stock, min_stock, emoji, color, supplier, location, entry_date, colors, sizes, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      [
        sku, name, cat, price || 0, stock || 0, min || 0, emoji || '👗', color || '#EFEAE2',
        supplier || null, location || null, JSON.stringify(colors || []), JSON.stringify(sizes || []), desc || null,
      ]
    );
  },

  async atualizar(sku, dados, executor = pool) {
    const { name, cat, price, stock, min, supplier, location, colors, sizes, desc } = dados;

    await executor.query(
      `UPDATE produtos SET name=?, cat=?, price=?, stock=?, min_stock=?, supplier=?, location=?, colors=?, sizes=?, descricao=?
       WHERE sku=?`,
      [name, cat, price, stock, min, supplier, location, JSON.stringify(colors || []), JSON.stringify(sizes || []), desc, sku]
    );
  },

  async atualizarEstoque(sku, novoEstoque, executor = pool) {
    await executor.query('UPDATE produtos SET stock = ? WHERE sku = ?', [novoEstoque, sku]);
  },

  // Soma (ou subtrai, com delta negativo) uma quantidade ao estoque atual
  async ajustarEstoque(sku, delta, executor = pool) {
    await executor.query('UPDATE produtos SET stock = stock + ? WHERE sku = ?', [delta, sku]);
  },

  async remover(sku, executor = pool) {
    const [resultado] = await executor.query('DELETE FROM produtos WHERE sku = ?', [sku]);
    return resultado.affectedRows > 0;
  },
};

export default ProdutoRepository;
