import CategoriaRepository from "../repositories/CategoriaRepository.js";

const CategoriaService = {
  async listarComContagem(lojaId) {
    return CategoriaRepository.listarComContagem(lojaId);
  },
};

export default CategoriaService;