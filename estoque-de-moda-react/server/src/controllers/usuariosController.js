import UsuarioService from '../services/UsuarioService.js';

const usuariosController = {
  // GET /api/usuarios/:id
  async buscarPorId(req, res) {
    try {
      const usuario = await UsuarioService.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  // PUT /api/usuarios/:id
  async atualizar(req, res) {
    const { nome, email } = req.body;
    if (!nome || !email) {
      return res.status(400).json({ error: 'Preencha ao menos nome e e-mail' });
    }

    try {
      const usuario = await UsuarioService.atualizar(req.params.id, req.body);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  // POST /api/usuarios/:id/foto (multipart/form-data, campo "foto")
  async enviarFoto(req, res) {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    try {
      const usuario = await UsuarioService.salvarFoto(req.params.id, req.file.filename);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao salvar a foto' });
    }
  },

  // DELETE /api/usuarios/:id/foto
  async removerFoto(req, res) {
    try {
      const usuario = await UsuarioService.removerFoto(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao remover a foto' });
    }
  },
};

export default usuariosController;

