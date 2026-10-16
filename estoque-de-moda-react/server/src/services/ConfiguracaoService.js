import ConfiguracaoRepository from "../repositories/ConfiguracaoRepository.js";

function paraTela(config) {
  if (!config) return null;

  return {
    loja_id: config.loja_id,
    nome_marca: config.nome_marca,
    alerta_estoque: Boolean(config.alerta_estoque),
    email_pedidos: Boolean(config.email_pedidos),
  };
}

const ConfiguracaoService = {
  async buscarPorLoja(lojaId) {
    let config = await ConfiguracaoRepository.buscarPorLoja(lojaId);

    if (!config) {
      await ConfiguracaoRepository.criarPadrao(lojaId);
      config = await ConfiguracaoRepository.buscarPorLoja(lojaId);
    }

    return paraTela(config);
  },

  async atualizar(lojaId, dados) {
    const atual = await this.buscarPorLoja(lojaId);
    if (!atual) return null;

    const nomeMarca =
      typeof dados.nome_marca === "string" && dados.nome_marca.trim()
        ? dados.nome_marca.trim()
        : atual.nome_marca;

    await ConfiguracaoRepository.atualizar(lojaId, {
      nome_marca: nomeMarca,
      alerta_estoque:
        dados.alerta_estoque === undefined
          ? atual.alerta_estoque
          : Boolean(dados.alerta_estoque),
      email_pedidos:
        dados.email_pedidos === undefined
          ? atual.email_pedidos
          : Boolean(dados.email_pedidos),
    });

    return this.buscarPorLoja(lojaId);
  },
};

export default ConfiguracaoService;