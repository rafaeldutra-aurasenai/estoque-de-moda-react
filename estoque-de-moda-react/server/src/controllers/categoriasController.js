import CategoriaService from '../services/CategoriaService.js';

const categoriasController = {
  // GET /api/categorias
  async listar(req, res) {
    try {
      const categorias = await CategoriaService.listarComContagem();
      res.json(categorias);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar categorias' });
    }
  },
};

export default categoriasController;
