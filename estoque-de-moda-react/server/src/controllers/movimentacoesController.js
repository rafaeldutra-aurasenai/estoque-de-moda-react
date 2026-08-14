import MovimentacaoService from '../services/MovimentacaoService.js';

// Traduz os códigos de erro que o model lança em respostas HTTP
function tratarErro(res, erro, mensagemPadrao) {
  if (erro.codigo === 'PRODUTO_NAO_ENCONTRADO') {
    return res.status(404).json({ erro: erro.message });
  }
  if (erro.codigo === 'ESTOQUE_INSUFICIENTE') {
    return res.status(400).json({ erro: erro.message });
  }
  console.error(erro);
  res.status(500).json({ erro: mensagemPadrao });
}

const movimentacoesController = {
  // GET /api/movimentacoes
  async listar(req, res) {
    try {
      const movimentacoes = await MovimentacaoService.listarRecentes();
      res.json(movimentacoes);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar movimentações' });
    }
  },

  // POST /api/movimentacoes
  async registrar(req, res) {
    const { sku, type, qty, reason } = req.body;

    if (!sku || !type || !qty || qty <= 0) {
      return res.status(400).json({ erro: 'Informe produto, tipo e uma quantidade válida' });
    }
    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ erro: "Tipo deve ser 'in' ou 'out'" });
    }

    try {
      const movimentacao = await MovimentacaoService.registrar({ sku, type, qty, reason });
      res.status(201).json(movimentacao);
    } catch (erro) {
      tratarErro(res, erro, 'Erro ao registrar movimentação');
    }
  },
};

export default movimentacoesController;
