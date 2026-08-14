import ProdutoService from '../services/ProdutoService.js';

const produtosController = {
  // GET /api/produtos
  async listar(req, res) {
    try {
      const produtos = await ProdutoService.listarTodos();
      res.json(produtos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
  },

  // GET /api/produtos/:sku
  async buscarPorSku(req, res) {
    try {
      const produto = await ProdutoService.buscarPorSku(req.params.sku);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
      res.json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
  },

  // POST /api/produtos
  async criar(req, res) {
    const { sku, name, cat } = req.body;
    if (!sku || !name || !cat) {
      return res.status(400).json({ erro: 'Preencha ao menos SKU, nome e categoria' });
    }

    try {
      const produto = await ProdutoService.criar(req.body);
      res.status(201).json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao criar produto (o SKU já existe?)' });
    }
  },

  // PUT /api/produtos/:sku
  async atualizar(req, res) {
    try {
      const produto = await ProdutoService.atualizar(req.params.sku, req.body);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
      res.json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
  },

  // DELETE /api/produtos/:sku
  async remover(req, res) {
    try {
      const removido = await ProdutoService.remover(req.params.sku);
      if (!removido) return res.status(404).json({ erro: 'Produto não encontrado' });
      res.status(204).send();
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao excluir produto' });
    }
  },
};

export default produtosController;
