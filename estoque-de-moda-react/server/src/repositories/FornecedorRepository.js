
import { pool } from "../config/db.js";

const CAMPOS = `
  id,
  loja_id,
  nome AS name,
  cnpj,
  categoria AS cat,
  produtos_fornecidos AS products,
  status,
  contato,
  telefone AS phone,
  email,
  endereco,
  cidade,
  observacoes AS notes,
  criado_em
`;

const FornecedorRepository = {
  async listar(lojaId, termoBusca = "", executor = pool) {
    let sql = `
      SELECT ${CAMPOS}
      FROM fornecedores
      WHERE loja_id = ?
    `;

    const params = [lojaId];

    if (termoBusca) {
      sql += `
        AND (
          nome LIKE ?
          OR cnpj LIKE ?
          OR contato LIKE ?
          OR telefone LIKE ?
          OR email LIKE ?
          OR categoria LIKE ?
          OR produtos_fornecidos LIKE ?
        )
      `;

      const termo = `%${termoBusca}%`;
      params.push(
        termo,
        termo,
        termo,
        termo,
        termo,
        termo,
        termo
      );
    }

    sql += " ORDER BY nome ASC";

    const [linhas] = await executor.query(sql, params);
    return linhas;
  },

  async buscarPorId(id, lojaId, executor = pool) {
    const [linhas] = await executor.query(
      `SELECT ${CAMPOS}
       FROM fornecedores
       WHERE id = ? AND loja_id = ?
       LIMIT 1`,
      [id, lojaId]
    );

    return linhas[0] ?? null;
  },

  async criar(dados, lojaId, executor = pool) {
    const [resultado] = await executor.query(
      `INSERT INTO fornecedores (
        loja_id,
        nome,
        cnpj,
        categoria,
        produtos_fornecidos,
        status,
        contato,
        telefone,
        email,
        endereco,
        cidade,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lojaId,
        dados.name.trim(),
        dados.cnpj || null,
        dados.cat || null,
        dados.products || null,
        dados.status || "Ativo",
        dados.contato || null,
        dados.phone || null,
        dados.email || null,
        dados.endereco || null,
        dados.cidade || null,
        dados.notes || null,
      ]
    );

    return resultado.insertId;
  },

  async atualizar(id, lojaId, dados, executor = pool) {
    const [resultado] = await executor.query(
      `UPDATE fornecedores
       SET nome = ?,
           cnpj = ?,
           categoria = ?,
           produtos_fornecidos = ?,
           status = ?,
           contato = ?,
           telefone = ?,
           email = ?,
           endereco = ?,
           cidade = ?,
           observacoes = ?
       WHERE id = ? AND loja_id = ?`,
      [
        dados.name.trim(),
        dados.cnpj || null,
        dados.cat || null,
        dados.products || null,
        dados.status || "Ativo",
        dados.contato || null,
        dados.phone || null,
        dados.email || null,
        dados.endereco || null,
        dados.cidade || null,
        dados.notes || null,
        id,
        lojaId,
      ]
    );

    return resultado.affectedRows > 0;
  },

  async remover(id, lojaId, executor = pool) {
    const [resultado] = await executor.query(
      `DELETE FROM fornecedores
       WHERE id = ? AND loja_id = ?`,
      [id, lojaId]
    );

    return resultado.affectedRows > 0;
  },
};

export default FornecedorRepository;
