import { pool } from '../config/db.js';

const CategoriaRepository = {
  async listarComContagem(executor = pool) {
    const [linhas] = await executor.query(`
      SELECT cat AS name, COUNT(*) AS skuCount, COALESCE(SUM(stock), 0) AS totalStock
      FROM produtos
      GROUP BY cat
      ORDER BY cat ASC
    `);
    return linhas;
  },
};

export default CategoriaRepository;
