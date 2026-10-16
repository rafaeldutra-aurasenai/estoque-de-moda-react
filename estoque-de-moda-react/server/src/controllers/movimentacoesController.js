import MovimentacaoService from "../services/MovimentacaoService.js";

function tratarErro(res, erro, mensagemPadrao) {
  if (erro.codigo === "PRODUTO_NAO_ENCONTRADO") {
    return res.status(404).json({ erro: erro.message });
  }

  if (
    erro.codigo === "ESTOQUE_INSUFICIENTE" ||
    erro.codigo === "QUANTIDADE_INVALIDA" ||
    erro.codigo === "TIPO_INVALIDO"
  ) {
    return res.status(400).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: mensagemPadrao });
}

const movimentacoesController = {
  async listar(req, res) {
    try {
      const movimentacoes = await MovimentacaoService.listarRecentes(
        req.usuario.loja_id
      );

      return res.json(movimentacoes);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({
        erro: "Erro ao buscar movimentações.",
      });
    }
  },

  async registrar(req, res) {
    const { sku, type, qty, reason } = req.body;

    if (!sku || !type || qty === undefined || qty === null) {
      return res.status(400).json({
        erro: "Informe produto, tipo e quantidade.",
      });
    }

    try {
      const movimentacao = await MovimentacaoService.registrar({
        sku,
        type,
        qty,
        reason,
        lojaId: req.usuario.loja_id,
        usuarioId: req.usuario.id,
      });

      return res.status(201).json(movimentacao);
    } catch (erro) {
      return tratarErro(
        res,
        erro,
        "Erro ao registrar movimentação."
      );
    }
  },
};

export default movimentacoesController;