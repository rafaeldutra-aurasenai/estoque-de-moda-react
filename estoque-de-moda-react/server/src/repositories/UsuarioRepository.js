import { pool } from '../config/db.js';

const UsuarioRepository = {
  async buscarPorId(id, executor = pool) {
    const [linhas] = await executor.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return linhas[0] ?? null;
  },

  async atualizar(id, dados, executor = pool) {
    const { nome, sobrenome, email, telefone, cargo, empresa } = dados;

    await executor.query(
      'UPDATE usuarios SET nome=?, sobrenome=?, email=?, telefone=?, cargo=?, empresa=? WHERE id=?',
      [nome, sobrenome || null, email, telefone || null, cargo || null, empresa || null, id]
    );
  },

  async atualizarFoto(id, foto, executor = pool) {
    await executor.query('UPDATE usuarios SET foto=? WHERE id=?', [foto, id]);
  },
};

export default UsuarioRepository;