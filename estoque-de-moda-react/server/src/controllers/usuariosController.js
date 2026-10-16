import UsuarioService from "../services/UsuarioService.js";

const usuariosController = {
  async buscarPorId(req, res) {
    // O usuário só pode consultar o próprio perfil.
    if (Number(req.params.id) !== Number(req.usuario.id)) {
      return res.status(403).json({ error: "Acesso não permitido." });
    }

    try {
      const usuario = await UsuarioService.buscarPorId(
        req.usuario.id,
        req.usuario.loja_id
      );

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
  },

  async atualizar(req, res) {
    if (Number(req.params.id) !== Number(req.usuario.id)) {
      return res.status(403).json({ error: "Acesso não permitido." });
    }

    try {
      const usuario = await UsuarioService.atualizar(
        req.usuario.id,
        req.usuario.loja_id,
        req.body
      );

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (erro) {
      if (erro.codigo === "DADOS_INVALIDOS") {
        return res.status(400).json({ error: erro.message });
      }

      if (erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Este e-mail já está cadastrado." });
      }

      console.error(erro);
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },

  async enviarFoto(req, res) {
    if (Number(req.params.id) !== Number(req.usuario.id)) {
      return res.status(403).json({ error: "Acesso não permitido." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }

    try {
      const usuario = await UsuarioService.salvarFoto(
        req.usuario.id,
        req.usuario.loja_id,
        req.file.filename
      );

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao salvar a foto." });
    }
  },

  async removerFoto(req, res) {
    if (Number(req.params.id) !== Number(req.usuario.id)) {
      return res.status(403).json({ error: "Acesso não permitido." });
    }

    try {
      const usuario = await UsuarioService.removerFoto(
        req.usuario.id,
        req.usuario.loja_id
      );

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: "Erro ao remover a foto." });
    }
  },
};

export default usuariosController;