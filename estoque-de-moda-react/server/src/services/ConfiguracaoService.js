Config
import ConfiguracaoRepository from '../repositories/ConfiguracaoRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';

// O banco guarda 0/1; a tela trabalha com true/false
function paraTela(config) {
  if (!config) return null;
  return {
    usuario_id: config.usuario_id,
    nome_marca: config.nome_marca,
    alerta_estoque: Boolean(config.alerta_estoque),
    email_pedidos: Boolean(config.email_pedidos),
    modo_escuro: Boolean(config.modo_escuro),
    moeda: config.moeda,
  };
}

const ConfiguracaoService = {
  async buscarPorUsuario(usuarioId) {
    const usuario = await UsuarioRepository.buscarPorId(usuarioId);
    if (!usuario) return null;

    let config = await ConfiguracaoRepository.buscarPorUsuario(usuarioId);
    if (!config) {
      await ConfiguracaoRepository.criarPadrao(usuarioId);
      config = await ConfiguracaoRepository.buscarPorUsuario(usuarioId);
    }
    return paraTela(config);
  },

  async atualizar(usuarioId, dados) {
    const atual = await this.buscarPorUsuario(usuarioId);
    if (!atual) return null;

    const mesclado = { ...atual, ...dados };
    await ConfiguracaoRepository.atualizar(usuarioId, {
      nome_marca: mesclado.nome_marca,
      alerta_estoque: mesclado.alerta_estoque ? 1 : 0,
      email_pedidos: mesclado.email_pedidos ? 1 : 0,
      modo_escuro: mesclado.modo_escuro ? 1 : 0,
      moeda: mesclado.moeda,
    });
    return this.buscarPorUsuario(usuarioId);
  },
};

export default ConfiguracaoService;