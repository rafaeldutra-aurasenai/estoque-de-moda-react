
import ProdutoService from "../services/ProdutoService.js";

const produtosController = {
  async listar(req, res) {
    try {
      const produtos = await ProdutoService.listarTodos(
        req.usuario.loja_id
      );
      res.json(produtos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
  },

  async buscarPorSku(req, res) {
    try {
      const produto = await ProdutoService.buscarPorSku(
        req.params.sku,
        req.usuario.loja_id
      );

      if (!produto) {
        return res.status(404).json({
          erro: "Produto não encontrado",
        });
      }

      res.json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao buscar produto" });
    }
  },

  async criar(req, res) {
    const { sku, name, cat } = req.body;

    if (!sku || !name || !cat) {
      return res.status(400).json({
        erro: "Preencha ao menos SKU, nome e categoria",
      });
    }

    try {
      const produto = await ProdutoService.criar(
        req.body,
        req.usuario.loja_id
      );

      res.status(201).json(produto);
    } catch (erro) {
      if (erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          erro: "Este SKU já existe no estoque da sua loja",
        });
      }

      console.error(erro);
      res.status(500).json({ erro: "Erro ao criar produto" });
    }
  },

  async atualizar(req, res) {
    try {
      const produto = await ProdutoService.atualizar(
        req.params.sku,
        req.body,
        req.usuario.loja_id
      );

      if (!produto) {
        return res.status(404).json({
          erro: "Produto não encontrado",
        });
      }

      res.json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
  },

  async remover(req, res) {
    try {
      const removido = await ProdutoService.remover(
        req.params.sku,
        req.usuario.loja_id
      );

      if (!removido) {
        return res.status(404).json({
          erro: "Produto não encontrado",
        });
      }

      res.status(204).send();
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao excluir produto" });
    }
  },
};

export default produtosController;