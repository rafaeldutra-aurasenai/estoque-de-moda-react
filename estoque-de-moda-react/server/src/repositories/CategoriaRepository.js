import { pool } from "../config/db.js";

const CategoriaRepository = {
  async listarComContagem(lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         cat AS name,
         COUNT(*) AS skuCount,
         COALESCE(SUM(stock), 0) AS totalStock
       FROM produtos
       WHERE loja_id = ?
         AND cat IS NOT NULL
         AND TRIM(cat) <> ''
       GROUP BY cat
       ORDER BY cat ASC`,
      [lojaId]
    );

    return linhas;
  },
};

export default CategoriaRepository;