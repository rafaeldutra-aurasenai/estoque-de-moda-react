import { pool } from '../config/db.js';
import ProdutoRepository from '../repositories/ProdutoRepository.js';
import MovimentacaoRepository from '../repositories/MovimentacaoRepository.js';

const MovimentacaoService = {
  async listarRecentes() {
    return MovimentacaoRepository.listarRecentes(50);
  },

  // Registra a movimentação e ajusta o estoque do produto, tudo em uma
  // transação (ou os dois passos acontecem, ou nenhum acontece).
  // Lança um erro com `codigo` quando a operação não pode ser concluída.
  async registrar({ sku, type, qty, reason }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const produto = await ProdutoRepository.buscarEstoqueComLock(sku, conn);
      if (!produto) {
        const erro = new Error('Produto não encontrado');
        erro.codigo = 'PRODUTO_NAO_ENCONTRADO';
        throw erro;
      }

      if (type === 'out' && produto.stock < qty) {
        const erro = new Error(`Estoque insuficiente (disponível: ${produto.stock})`);
        erro.codigo = 'ESTOQUE_INSUFICIENTE';
        throw erro;
      }

      const novoEstoque = type === 'in' ? produto.stock + Number(qty) : produto.stock - Number(qty);
      await ProdutoRepository.atualizarEstoque(sku, novoEstoque, conn);

      const id = await MovimentacaoRepository.criar({ sku, type, qty, reason }, conn);

      await conn.commit();
      return MovimentacaoRepository.buscarPorId(id);
    } catch (erro) {
      await conn.rollback();
      throw erro;
    } finally {
      conn.release();
    }
  },
};

export default MovimentacaoService;
