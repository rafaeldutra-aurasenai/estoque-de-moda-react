import { pool } from "../config/db.js";

const UsuarioRepository = {
  async buscarPorId(id, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT
         id, loja_id, nome, sobrenome, email, telefone,
         cargo, empresa, foto, papel, criado_em
       FROM usuarios
       WHERE id = ? AND loja_id = ?
       LIMIT 1`,
      [id, lojaId]
    );

    return linhas[0] ?? null;
  },

  async atualizar(id, lojaId, dados, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE usuarios
       SET nome = ?,
           sobrenome = ?,
           email = ?,
           telefone = ?,
           cargo = ?,
           empresa = ?
       WHERE id = ? AND loja_id = ?`,
      [
        dados.nome,
        dados.sobrenome || null,
        dados.email.trim().toLowerCase(),
        dados.telefone || null,
        dados.cargo || null,
        dados.empresa || null,
        id,
        lojaId,
      ]
    );

    return resultado.affectedRows > 0;
  },

  async atualizarFoto(id, lojaId, foto, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE usuarios
       SET foto = ?
       WHERE id = ? AND loja_id = ?`,
      [foto, id, lojaId]
    );

    return resultado.affectedRows > 0;
  },
};

export default UsuarioRepository;