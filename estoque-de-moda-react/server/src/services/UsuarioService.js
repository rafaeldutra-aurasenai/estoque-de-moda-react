import fs from "node:fs/promises";
import path from "node:path";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import { PASTA_UPLOADS } from "../config/upload.js";

function comFotoUrl(usuario) {
  if (!usuario) return null;

  return {
    ...usuario,
    fotoUrl: usuario.foto ? `/uploads/${usuario.foto}` : null,
  };
}

async function apagarArquivo(nomeArquivo) {
  if (!nomeArquivo) return;

  try {
    await fs.unlink(path.join(PASTA_UPLOADS, nomeArquivo));
  } catch {
    // O arquivo pode já ter sido removido.
  }
}

const UsuarioService = {
  async buscarPorId(id, lojaId) {
    return comFotoUrl(await UsuarioRepository.buscarPorId(id, lojaId));
  },

  async atualizar(id, lojaId, dados) {
    const existente = await this.buscarPorId(id, lojaId);
    if (!existente) return null;

    const nome = String(dados.nome || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();

    if (!nome || !email) {
      const erro = new Error("Informe nome e e-mail.");
      erro.codigo = "DADOS_INVALIDOS";
      throw erro;
    }

    const atualizado = await UsuarioRepository.atualizar(id, lojaId, {
      ...existente,
      ...dados,
      nome,
      email,
    });

    if (!atualizado) return null;

    return this.buscarPorId(id, lojaId);
  },

  async salvarFoto(id, lojaId, nomeArquivo) {
    const existente = await this.buscarPorId(id, lojaId);

    if (!existente) {
      await apagarArquivo(nomeArquivo);
      return null;
    }

    const atualizou = await UsuarioRepository.atualizarFoto(
      id,
      lojaId,
      nomeArquivo
    );

    if (!atualizou) {
      await apagarArquivo(nomeArquivo);
      return null;
    }

    if (existente.foto !== nomeArquivo) {
      await apagarArquivo(existente.foto);
    }

    return this.buscarPorId(id, lojaId);
  },

  async removerFoto(id, lojaId) {
    const existente = await this.buscarPorId(id, lojaId);
    if (!existente) return null;

    await UsuarioRepository.atualizarFoto(id, lojaId, null);
    await apagarArquivo(existente.foto);

    return this.buscarPorId(id, lojaId);
  },
};

export default UsuarioService;