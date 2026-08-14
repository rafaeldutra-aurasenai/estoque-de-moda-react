import FornecedorService from '../services/FornecedorService.js';

const fornecedoresController = {
  // GET /api/fornecedores?q=texto
  async listar(req, res) {
    try {
      const { q } = req.query;
      const fornecedores = await FornecedorService.listar(q);
      res.json(fornecedores);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar fornecedores' });
    }
  },

  // GET /api/fornecedores/:id
  async buscarPorId(req, res) {
    try {
      const fornecedor = await FornecedorService.buscarPorId(req.params.id);
      if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
      res.json(fornecedor);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar fornecedor' });
    }
  },

  // POST /api/fornecedores
  async criar(req, res) {
    const { name, cat } = req.body;
    if (!name || !cat) {
      return res.status(400).json({ error: 'Preencha ao menos nome e categoria' });
    }

    try {
      const fornecedor = await FornecedorService.criar(req.body);
      res.status(201).json(fornecedor);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao criar fornecedor' });
    }
  },

  // PUT /api/fornecedores/:id
  async atualizar(req, res) {
    try {
      const fornecedor = await FornecedorService.atualizar(req.params.id, req.body);
      if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
      res.json(fornecedor);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
  },

  // DELETE /api/fornecedores/:id
  async remover(req, res) {
    try {
      const removido = await FornecedorService.remover(req.params.id);
      if (!removido) return res.status(404).json({ error: 'Fornecedor não encontrado' });
      res.status(204).send();
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao excluir fornecedor' });
    }
  },
};

export default fornecedoresController;
