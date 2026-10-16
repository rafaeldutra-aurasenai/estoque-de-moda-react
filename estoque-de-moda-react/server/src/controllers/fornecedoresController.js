import FornecedorService from "../services/FornecedorService.js";

const fornecedoresController = {
  async listar(req, res) {
    try {
      const dados = await FornecedorService.listar(
        req.usuario.loja_id,
        req.query.q || ""
      );
      return res.json(dados);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao buscar fornecedores." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const fornecedor = await FornecedorService.buscarPorId(
        req.params.id,
        req.usuario.loja_id
      );

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado." });
      }

      return res.json(fornecedor);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao buscar fornecedor." });
    }
  },

  async criar(req, res) {
    try {
      const fornecedor = await FornecedorService.criar(
        req.body,
        req.usuario.loja_id
      );

      return res.status(201).json(fornecedor);
    } catch (erro) {
      if (erro.codigo === "DADOS_INVALIDOS") {
        return res.status(400).json({ error: erro.message });
      }

      console.error(erro);
      return res.status(500).json({ error: "Erro ao criar fornecedor." });
    }
  },

  async atualizar(req, res) {
    try {
      const fornecedor = await FornecedorService.atualizar(
        req.params.id,
        req.usuario.loja_id,
        req.body
      );

      if (!fornecedor) {
        return res.status(404).json({ error: "Fornecedor não encontrado." });
      }

      return res.json(fornecedor);
    } catch (erro) {
      if (erro.codigo === "DADOS_INVALIDOS") {
        return res.status(400).json({ error: erro.message });
      }

      console.error(erro);
      return res.status(500).json({ error: "Erro ao atualizar fornecedor." });
    }
  },

  async remover(req, res) {
    try {
      const removido = await FornecedorService.remover(
        req.params.id,
        req.usuario.loja_id
      );

      if (!removido) {
        return res.status(404).json({ error: "Fornecedor não encontrado." });
      }

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao excluir fornecedor." });
    }
  },
};

export default fornecedoresController;