import { pool } from "../config/db.js";
import ProdutoRepository from "../repositories/ProdutoRepository.js";
import MovimentacaoRepository from "../repositories/MovimentacaoRepository.js";

const MovimentacaoService = {
  async listarRecentes(lojaId) {
    return MovimentacaoRepository.listarRecentes(lojaId, 50);
  },

  async registrar({ sku, type, qty, reason, lojaId, usuarioId }) {
    const quantidade = Number(qty);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      const erro = new Error("A quantidade deve ser um número inteiro positivo.");
      erro.codigo = "QUANTIDADE_INVALIDA";
      throw erro;
    }

    if (!["in", "out"].includes(type)) {
      const erro = new Error("Tipo de movimentação inválido.");
      erro.codigo = "TIPO_INVALIDO";
      throw erro;
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const produto = await ProdutoRepository.buscarEstoqueComLock(
        sku,
        lojaId,
        conn
      );

      if (!produto) {
        const erro = new Error("Produto não encontrado nesta loja.");
        erro.codigo = "PRODUTO_NAO_ENCONTRADO";
        throw erro;
      }

      if (type === "out" && Number(produto.stock) < quantidade) {
        const erro = new Error(
          `Estoque insuficiente. Disponível: ${produto.stock}.`
        );
        erro.codigo = "ESTOQUE_INSUFICIENTE";
        throw erro;
      }

      const novoEstoque =
        type === "in"
          ? Number(produto.stock) + quantidade
          : Number(produto.stock) - quantidade;

      await ProdutoRepository.atualizarEstoque(
        sku,
        lojaId,
        novoEstoque,
        conn
      );

      const id = await MovimentacaoRepository.criar(
        {
          lojaId,
          produtoId: produto.id,
          usuarioId,
          type,
          qty: quantidade,
          reason,
        },
        conn
      );

      await conn.commit();

      return MovimentacaoRepository.buscarPorId(id, lojaId);
    } catch (erro) {
      await conn.rollback();
      throw erro;
    } finally {
      conn.release();
    }
  },
};

export default MovimentacaoService;