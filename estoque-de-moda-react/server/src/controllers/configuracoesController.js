import ConfiguracaoService from "../services/ConfiguracaoService.js";

const configuracoesController = {
  async buscar(req, res) {
    try {
      const config = await ConfiguracaoService.buscarPorLoja(
        req.usuario.loja_id
      );

      return res.json(config);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({
        error: "Erro ao buscar configurações da loja.",
      });
    }
  },

  async atualizar(req, res) {
    try {
      const config = await ConfiguracaoService.atualizar(
        req.usuario.loja_id,
        req.body
      );

      return res.json(config);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({
        error: "Erro ao salvar configurações da loja.",
      });
    }
  },
};

export default configuracoesController;