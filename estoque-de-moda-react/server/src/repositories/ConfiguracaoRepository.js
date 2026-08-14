import { pool } from '../config/db.js';

const ConfiguracaoRepository = {
  async buscarPorUsuario(usuarioId, executor = pool) {
    const [linhas] = await executor.query(
      'SELECT * FROM configuracoes WHERE usuario_id = ?',
      [usuarioId]
    );
    return linhas[0] ?? null;
  },

  async criarPadrao(usuarioId, executor = pool) {
    await executor.query('INSERT INTO configuracoes (usuario_id) VALUES (?)', [usuarioId]);
  },

  async atualizar(usuarioId, dados, executor = pool) {
    const { nome_marca, alerta_estoque, email_pedidos, modo_escuro, moeda } = dados;

    await executor.query(
      `UPDATE configuracoes
         SET nome_marca=?, alerta_estoque=?, email_pedidos=?, modo_escuro=?, moeda=?
       WHERE usuario_id=?`,
      [nome_marca, alerta_estoque, email_pedidos, modo_escuro, moeda, usuarioId]
    );
  },
};

export default ConfiguracaoRepository;