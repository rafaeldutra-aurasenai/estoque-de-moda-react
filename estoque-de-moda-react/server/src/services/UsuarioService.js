Usuario
import fs from 'node:fs/promises';
import path from 'node:path';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { PASTA_UPLOADS } from '../config/upload.js';

// Monta o campo extra fotoUrl (caminho publico servido pelo express.static)
function comFotoUrl(usuario) {
  if (!usuario) return null;
  return { ...usuario, fotoUrl: usuario.foto ? `/uploads/${usuario.foto}` : null };
}

async function apagarArquivo(nomeArquivo) {
  if (!nomeArquivo) return;
  try {
    await fs.unlink(path.join(PASTA_UPLOADS, nomeArquivo));
  } catch {
    // arquivo ja nao existe: nada a fazer
  }
}

const UsuarioService = {
  async buscarPorId(id) {
    return comFotoUrl(await UsuarioRepository.buscarPorId(id));
  },

  async atualizar(id, dados) {
    const existente = await UsuarioRepository.buscarPorId(id);
    if (!existente) return null;

    await UsuarioRepository.atualizar(id, { ...existente, ...dados });
    return this.buscarPorId(id);
  },

  // Troca a foto e remove do disco a imagem antiga
  async salvarFoto(id, nomeArquivo) {
    const existente = await UsuarioRepository.buscarPorId(id);
    if (!existente) {
      await apagarArquivo(nomeArquivo);
      return null;
    }

    await UsuarioRepository.atualizarFoto(id, nomeArquivo);
    if (existente.foto !== nomeArquivo) await apagarArquivo(existente.foto);
    return this.buscarPorId(id);
  },

  async removerFoto(id) {
    const existente = await UsuarioRepository.buscarPorId(id);
    if (!existente) return null;

    await UsuarioRepository.atualizarFoto(id, null);
    await apagarArquivo(existente.foto);
    return this.buscarPorId(id);
  },
};

export default UsuarioService;
