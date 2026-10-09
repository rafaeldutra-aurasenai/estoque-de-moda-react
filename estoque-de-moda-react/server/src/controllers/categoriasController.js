import CategoriaService from "../services/CategoriaService.js";

const categoriasController = {
  async listar(req, res) {
    try {
      const categorias = await CategoriaService.listarComContagem(
        req.usuario.loja_id
      );

      return res.json(categorias);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Erro ao buscar categorias." });
    }
  },
};

export default categoriasController;