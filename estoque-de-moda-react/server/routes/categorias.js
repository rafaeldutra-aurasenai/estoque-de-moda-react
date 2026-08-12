import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/categorias -> agrupa os produtos por categoria
router.get('/', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT cat AS name, COUNT(*) AS skuCount, COALESCE(SUM(stock), 0) AS totalStock
      FROM produtos
      GROUP BY cat
      ORDER BY cat ASC
    `);
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

export default router;