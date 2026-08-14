import ConfiguracaoService from '../services/ConfiguracaoService.js';

const configuracoesController = {
  // GET /api/configuracoes/:usuarioId
  async buscar(req, res) {
    try {
      const config = await ConfiguracaoService.buscarPorUsuario(req.params.usuarioId);
      if (!config) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(config);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  },

  // PUT /api/configuracoes/:usuarioId
  async atualizar(req, res) {
    try {
      const config = await ConfiguracaoService.atualizar(req.params.usuarioId, req.body);
      if (!config) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(config);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
  },
};

export default configuracoesController;