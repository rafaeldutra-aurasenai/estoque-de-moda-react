import { pool } from '../config/db.js';
import ProdutoRepository from '../repositories/ProdutoRepository.js';
import PedidoRepository from '../repositories/PedidoRepository.js';
import MovimentacaoRepository from '../repositories/MovimentacaoRepository.js';

const PedidoService = {
  async listarComTotais() {
    return PedidoRepository.listarComTotais();
  },

  // Retorna null se o pedido não existir
  async buscarPorId(id) {
    const pedido = await PedidoRepository.buscarPorId(id);
    if (!pedido) return null;

    const itens = await PedidoRepository.buscarItens(id);
    return { ...pedido, itens };
  },

  // Confere estoque de TODOS os itens antes de mexer em qualquer coisa,
  // travando as linhas (FOR UPDATE) até o pedido ser confirmado.
  async _validarEstoque(conn, items) {
    for (const item of items) {
      const produto = await ProdutoRepository.buscarEstoqueComLock(item.sku, conn);
      if (!produto) {
        const erro = new Error(`Produto ${item.sku} não encontrado`);
        erro.codigo = 'PRODUTO_NAO_ENCONTRADO';
        throw erro;
      }
      if (produto.stock < item.qty) {
        const erro = new Error(`Estoque insuficiente para ${item.sku} (disponível: ${produto.stock})`);
        erro.codigo = 'ESTOQUE_INSUFICIENTE';
        throw erro;
      }
    }
  },

  // Cria pedido, itens, desconta estoque e registra movimentações —
  // tudo em uma única transação.
  async criar({ client_name, client_email, city, freight, items }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await this._validarEstoque(conn, items);

      const pedidoId = await PedidoRepository.criarPedido(
        { client_name, client_email, city, freight, status: 'Pendente' },
        conn
      );

      for (const item of items) {
        const produto = await ProdutoRepository.buscarPorSku(item.sku, conn);

        await PedidoRepository.criarItem(
          { pedido_id: pedidoId, sku: item.sku, variant: item.variant, qty: item.qty, price: produto.price },
          conn
        );

        await ProdutoRepository.ajustarEstoque(item.sku, -item.qty, conn);

        await MovimentacaoRepository.criar(
          { sku: item.sku, type: 'out', qty: item.qty, reason: `Pedido #${pedidoId}` },
          conn
        );
      }

      await conn.commit();
      return { id: pedidoId };
    } catch (erro) {
      await conn.rollback();
      throw erro;
    } finally {
      conn.release();
    }
  },

  // Retorna null se o pedido não existir
  async atualizarStatus(id, status) {
    const pedido = await PedidoRepository.buscarPorId(id);
    if (!pedido) return null;

    await PedidoRepository.atualizarStatus(id, status);
    return this.buscarPorId(id);
  },
};

export default PedidoService;
