import FornecedorRepository from "../repositories/FornecedorRepository.js";

const FornecedorService = {
  async listar(lojaId, termoBusca) {
    return FornecedorRepository.listar(lojaId, termoBusca);
  },

  async buscarPorId(id, lojaId) {
    return FornecedorRepository.buscarPorId(id, lojaId);
  },

  async criar(dados, lojaId) {
    if (!dados.name || !dados.name.trim()) {
      const erro = new Error("Informe o nome do fornecedor.");
      erro.codigo = "DADOS_INVALIDOS";
      throw erro;
    }

    const id = await FornecedorRepository.criar(dados, lojaId);
    return this.buscarPorId(id, lojaId);
  },

  async atualizar(id, lojaId, dados) {
    const existente = await this.buscarPorId(id, lojaId);
    if (!existente) return null;

    if (!dados.name || !dados.name.trim()) {
      const erro = new Error("Informe o nome do fornecedor.");
      erro.codigo = "DADOS_INVALIDOS";
      throw erro;
    }

    const atualizado = await FornecedorRepository.atualizar(
      id,
      lojaId,
      dados
    );

    if (!atualizado) return null;
    return this.buscarPorId(id, lojaId);
  },

  async remover(id, lojaId) {
    return FornecedorRepository.remover(id, lojaId);
  },
};

export default FornecedorService;