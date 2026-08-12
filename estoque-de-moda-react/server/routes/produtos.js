import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatadorData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

// Transforma uma linha do banco no formato que a tela React já espera
// (mesmo "shape" que existia em src/data.js)
function paraProduto(linha) {
  const status = linha.stock === 0 ? 'out' : linha.stock <= linha.min_stock ? 'low' : 'ok';
  return {
    sku: linha.sku,
    name: linha.name,
    cat: linha.cat,
    price: formatador.format(linha.price),
    priceValue: Number(linha.price), 
    stock: linha.stock,
    min: linha.min_stock,
    status,
    emoji: linha.emoji,
    color: linha.color,
    supplier: linha.supplier,
    location: linha.location,
    entry: linha.entry_date ? formatadorData.format(new Date(linha.entry_date)).replace('.', '') : '',
    colors: typeof linha.colors === 'string' ? JSON.parse(linha.colors) : linha.colors,
    sizes: typeof linha.sizes === 'string' ? JSON.parse(linha.sizes) : linha.sizes,
    desc: linha.descricao,
  };
}

// GET /api/produtos -> lista todos
router.get('/', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM produtos ORDER BY criado_em DESC');
    res.json(linhas.map(paraProduto));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

// GET /api/produtos/:sku -> busca um produto pelo SKU
router.get('/:sku', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM produtos WHERE sku = ?', [req.params.sku]);
    if (linhas.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(paraProduto(linhas[0]));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

// POST /api/produtos -> cria um novo produto
router.post('/', async (req, res) => {
  const { sku, name, cat, price, stock, min, supplier, location, colors, sizes, desc, emoji, color } = req.body;

  if (!sku || !name || !cat) {
    return res.status(400).json({ erro: 'Preencha ao menos SKU, nome e categoria' });
  }

  try {
    await pool.query(
      `INSERT INTO produtos (sku, name, cat, price, stock, min_stock, emoji, color, supplier, location, entry_date, colors, sizes, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      [sku, name, cat, price || 0, stock || 0, min || 0, emoji || '👗', color || '#EFEAE2',
       supplier || null, location || null, JSON.stringify(colors || []), JSON.stringify(sizes || []), desc || null]
    );
    const [linhas] = await pool.query('SELECT * FROM produtos WHERE sku = ?', [sku]);
    res.status(201).json(paraProduto(linhas[0]));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar produto (o SKU já existe?)' });
  }
});

// PUT /api/produtos/:sku -> atualiza um produto existente
router.put('/:sku', async (req, res) => {
  const { name, cat, price, stock, min, supplier, location, colors, sizes, desc } = req.body;
  try {
    await pool.query(
      `UPDATE produtos SET name=?, cat=?, price=?, stock=?, min_stock=?, supplier=?, location=?, colors=?, sizes=?, descricao=?
       WHERE sku=?`,
      [name, cat, price, stock, min, supplier, location, JSON.stringify(colors || []), JSON.stringify(sizes || []), desc, req.params.sku]
    );
    const [linhas] = await pool.query('SELECT * FROM produtos WHERE sku = ?', [req.params.sku]);
    if (linhas.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(paraProduto(linhas[0]));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// DELETE /api/produtos/:sku -> remove um produto
router.delete('/:sku', async (req, res) => {
  try {
    const [resultado] = await pool.query('DELETE FROM produtos WHERE sku = ?', [req.params.sku]);
    if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

export default router;
