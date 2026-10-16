import PedidoService from "../services/PedidoService.js";

function tratarErro(res, erro, mensagemPadrao) {
  if (erro.codigo === "PRODUTO_NAO_ENCONTRADO") {
    return res.status(404).json({ erro: erro.message });
  }

  if (
    erro.codigo === "ESTOQUE_INSUFICIENTE" ||
    erro.codigo === "PEDIDO_SEM_ITENS" ||
    erro.codigo === "ITEM_INVALIDO" ||
    erro.codigo === "STATUS_INVALIDO"
  ) {
    return res.status(400).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: mensagemPadrao });
}

const pedidosController = {
  async listar(req, res) {
    try {
      return res.json(
        await PedidoService.listarComTotais(req.usuario.loja_id)
      );
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Erro ao buscar pedidos." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const pedido = await PedidoService.buscarPorId(
        req.params.id,
        req.usuario.loja_id
      );

      if (!pedido) {
        return res.status(404).json({ erro: "Pedido não encontrado." });
      }

      return res.json(pedido);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Erro ao buscar pedido." });
    }
  },

  async criar(req, res) {
    const { client_name, items } = req.body;

    if (!client_name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        erro: "Informe o cliente e pelo menos um item.",
      });
    }

    try {
      const pedido = await PedidoService.criar({
        ...req.body,
        lojaId: req.usuario.loja_id,
        usuarioId: req.usuario.id,
      });

      return res.status(201).json(pedido);
    } catch (erro) {
      return tratarErro(res, erro, "Erro ao criar pedido.");
    }
  },

  async atualizarStatus(req, res) {
    try {
      const pedido = await PedidoService.atualizarStatus(
        req.params.id,
        req.usuario.loja_id,
        String(req.body.status || "").toLowerCase()
      );

      if (!pedido) {
        return res.status(404).json({ erro: "Pedido não encontrado." });
      }

      return res.json(pedido);
    } catch (erro) {
      return tratarErro(res, erro, "Erro ao atualizar status do pedido.");
    }
  },
};

export default pedidosController;