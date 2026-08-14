Usuarios
import { Router } from 'express';
import multer from 'multer';
import usuariosController from '../controllers/usuariosController.js';
import { uploadFoto } from '../config/upload.js';

const router = Router();

// O multer le o multipart/form-data e grava o arquivo em server/uploads.
// Depois disso req.file.filename tem o nome salvo, que vai para o MySQL.
function receberFoto(req, res, next) {
  uploadFoto.single('foto')(req, res, (erro) => {
    if (erro instanceof multer.MulterError) {
      const mensagem =
        erro.code === 'LIMIT_FILE_SIZE' ? 'A imagem deve ter no máximo 2 MB' : 'Erro no upload da imagem';
      return res.status(400).json({ error: mensagem });
    }
    if (erro) return res.status(400).json({ error: erro.message });
    next();
  });
}

router.get('/:id', usuariosController.buscarPorId);
router.put('/:id', usuariosController.atualizar);
router.post('/:id/foto', receberFoto, usuariosController.enviarFoto);
router.delete('/:id/foto', usuariosController.removerFoto);

export default router;
