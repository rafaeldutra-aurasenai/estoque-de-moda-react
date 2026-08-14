import { pool } from '../config/db.js';

const FornecedorRepository = {
  async listar(termoBusca, executor = pool) {
    let query = 'SELECT * FROM fornecedores';
    const params = [];

    if (termoBusca) {
      query += ' WHERE name LIKE ? OR cat LIKE ? OR email LIKE ? OR cnpj LIKE ?';
      const termo = `%${termoBusca}%`;
      params.push(termo, termo, termo, termo);
    }

    query += ' ORDER BY name ASC';

    const [linhas] = await executor.query(query, params);
    return linhas;
  },

  async buscarPorId(id, executor = pool) {
    const [linhas] = await executor.query('SELECT * FROM fornecedores WHERE id = ?', [id]);
    return linhas[0] ?? null;
  },

  async criar(dados, executor = pool) {
    const { name, cnpj, cat, phone, email, products, status } = dados;

    const [resultado] = await executor.query(
      'INSERT INTO fornecedores (name, cnpj, cat, phone, email, products, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, cnpj || null, cat, phone || null, email || null, products || null, status || 'Ativo']
    );
    return resultado.insertId;
  },

  async atualizar(id, dados, executor = pool) {
    const { name, cnpj, cat, phone, email, products, status } = dados;

    await executor.query(
      'UPDATE fornecedores SET name=?, cnpj=?, cat=?, phone=?, email=?, products=?, status=? WHERE id=?',
      [name, cnpj || null, cat, phone || null, email || null, products || null, status, id]
    );
  },

  async remover(id, executor = pool) {
    const [resultado] = await executor.query('DELETE FROM fornecedores WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },
};

export default FornecedorRepository;
