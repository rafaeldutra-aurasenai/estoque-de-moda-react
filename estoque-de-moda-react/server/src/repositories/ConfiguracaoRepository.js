import { pool } from "../config/db.js";

const ConfiguracaoRepository = {
  async buscarPorLoja(lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT loja_id, nome_marca, alerta_estoque, email_pedidos
       FROM configuracoes
       WHERE loja_id = ?
       LIMIT 1`,
      [lojaId]
    );

    return linhas[0] ?? null;
  },

  async criarPadrao(lojaId, nomeMarca = "Minha Loja", executor = pool) {
    await executor.query(
      `INSERT INTO configuracoes
         (loja_id, nome_marca, alerta_estoque, email_pedidos)
       VALUES (?, ?, 1, 1)
       ON DUPLICATE KEY UPDATE loja_id = VALUES(loja_id)`,
      [lojaId, nomeMarca]
    );
  },

  async atualizar(lojaId, dados, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE configuracoes
       SET nome_marca = ?,
           alerta_estoque = ?,
           email_pedidos = ?
       WHERE loja_id = ?`,
      [
        dados.nome_marca,
        dados.alerta_estoque ? 1 : 0,
        dados.email_pedidos ? 1 : 0,
        lojaId,
      ]
    );

    return resultado.affectedRows > 0;
  },
};

export default ConfiguracaoRepository;