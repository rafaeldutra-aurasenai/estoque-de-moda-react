import CategoriaRepository from '../repositories/CategoriaRepository.js';

const CategoriaService = {
  async listarComContagem() {
    return CategoriaRepository.listarComContagem();
  },
};

export default CategoriaService;
