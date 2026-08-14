import FornecedorRepository from '../repositories/FornecedorRepository.js';

const FornecedorService = {
  async listar(termoBusca) {
    return FornecedorRepository.listar(termoBusca);
  },

  async buscarPorId(id) {
    return FornecedorRepository.buscarPorId(id);
  },

  async criar(dados) {
    const status = dados.status || 'Ativo';
    const id = await FornecedorRepository.criar({ ...dados, status });
    return this.buscarPorId(id);
  },

  // Retorna null se o fornecedor não existir
  async atualizar(id, dados) {
    const existente = await FornecedorRepository.buscarPorId(id);
    if (!existente) return null;

    await FornecedorRepository.atualizar(id, dados);
    return this.buscarPorId(id);
  },

  async remover(id) {
    return FornecedorRepository.remover(id);
  },
};

export default FornecedorService;
