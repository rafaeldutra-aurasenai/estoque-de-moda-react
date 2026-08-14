import PedidoService from '../services/PedidoService.js';

const STATUS_VALIDOS = ['Pendente', 'Enviado', 'Entregue', 'Cancelado'];

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

const pedidosController = {
  // GET /api/pedidos
  async listar(req, res) {
    try {
      const pedidos = await PedidoService.listarComTotais();
      res.json(pedidos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar pedidos' });
    }
  },

  // GET /api/pedidos/:id
  async buscarPorId(req, res) {
    try {
      const pedido = await PedidoService.buscarPorId(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      res.json(pedido);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar pedido' });
    }
  },

  // POST /api/pedidos
  async criar(req, res) {
    const { client_name, items } = req.body;
    if (!client_name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ erro: 'Informe o cliente e ao menos um item' });
    }

    try {
      const pedido = await PedidoService.criar(req.body);
      res.status(201).json(pedido);
    } catch (erro) {
      tratarErro(res, erro, 'Erro ao criar pedido');
    }
  },

  // PUT /api/pedidos/:id/status
  async atualizarStatus(req, res) {
    const { status } = req.body;
    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    try {
      const pedido = await PedidoService.atualizarStatus(req.params.id, status);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      res.json(pedido);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao atualizar status' });
    }
  },
};

export default pedidosController;
