import { pool } from "../config/db.js";
import ProdutoRepository from "../repositories/ProdutoRepository.js";
import PedidoRepository from "../repositories/PedidoRepository.js";
import MovimentacaoRepository from "../repositories/MovimentacaoRepository.js";

const STATUS_VALIDOS = [
  "pendente",
  "processando",
  "enviado",
  "entregue",
  "cancelado",
];

const PedidoService = {
  async listarComTotais(lojaId) {
    return PedidoRepository.listarComTotais(lojaId);
  },

  async buscarPorId(id, lojaId) {
    const pedido = await PedidoRepository.buscarPorId(id, lojaId);

    if (!pedido) return null;

    const itens = await PedidoRepository.buscarItens(id, lojaId);

    return { ...pedido, itens };
  },

  async criar({ client_name, client_email, city, freight, items, lojaId, usuarioId }) {
    if (!Array.isArray(items) || items.length === 0) {
      const erro = new Error("O pedido precisa ter pelo menos um item.");
      erro.codigo = "PEDIDO_SEM_ITENS";
      throw erro;
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const itensValidados = [];

      for (const item of items) {
        const sku = String(item.sku || "").trim();
        const quantidade = Number(item.qty);

        if (!sku || !Number.isInteger(quantidade) || quantidade <= 0) {
          const erro = new Error("Um dos itens do pedido é inválido.");
          erro.codigo = "ITEM_INVALIDO";
          throw erro;
        }

        const produto = await ProdutoRepository.buscarEstoqueComLock(
          sku,
          lojaId,
          conn
        );

        if (!produto) {
          const erro = new Error(`Produto ${sku} não encontrado nesta loja.`);
          erro.codigo = "PRODUTO_NAO_ENCONTRADO";
          throw erro;
        }

        if (Number(produto.stock) < quantidade) {
          const erro = new Error(
            `Estoque insuficiente para ${sku}. Disponível: ${produto.stock}.`
          );
          erro.codigo = "ESTOQUE_INSUFICIENTE";
          throw erro;
        }

        const [dadosProduto] = await conn.query(
          `SELECT id, sku, price, stock
           FROM produtos
           WHERE id = ? AND loja_id = ?
           LIMIT 1`,
          [produto.id, lojaId]
        );

        if (!dadosProduto.length) {
          const erro = new Error(`Produto ${sku} não encontrado nesta loja.`);
          erro.codigo = "PRODUTO_NAO_ENCONTRADO";
          throw erro;
        }

        itensValidados.push({
          produto: dadosProduto[0],
          quantidade,
        });
      }

      const pedidoId = await PedidoRepository.criarPedido(
        {
          lojaId,
          client_name,
          client_email,
          city,
          freight,
          status: "pendente",
        },
        conn
      );

      for (const item of itensValidados) {
        await PedidoRepository.criarItem(
          {
            pedido_id: pedidoId,
            produto_id: item.produto.id,
            quantidade: item.quantidade,
            preco_unitario: Number(item.produto.price),
          },
          conn
        );

        await ProdutoRepository.atualizarEstoque(
          item.produto.sku,
          lojaId,
          Number(item.produto.stock) - item.quantidade,
          conn
        );

        await MovimentacaoRepository.criar(
          {
            lojaId,
            produtoId: item.produto.id,
            usuarioId,
            type: "out",
            qty: item.quantidade,
            reason: `Pedido #${pedidoId}`,
          },
          conn
        );
      }

      await conn.commit();

      return this.buscarPorId(pedidoId, lojaId);
    } catch (erro) {
      await conn.rollback();
      throw erro;
    } finally {
      conn.release();
    }
  },

  async atualizarStatus(id, lojaId, status) {
    if (!STATUS_VALIDOS.includes(status)) {
      const erro = new Error("Status de pedido inválido.");
      erro.codigo = "STATUS_INVALIDO";
      throw erro;
    }

    const atualizado = await PedidoRepository.atualizarStatus(
      id,
      lojaId,
      status
    );

    if (!atualizado) return null;

    return this.buscarPorId(id, lojaId);
  },
};

export default PedidoService;