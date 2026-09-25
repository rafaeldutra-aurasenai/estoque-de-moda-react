import { Router } from 'express';
import produtosController from '../controllers/produtosController.js';
import autenticarToken from '../middlewares/authMiddleware.js';
import upload from '../config/upload.js';

const router = Router();

// Rotas públicas (consulta de produtos)
router.get('/', produtosController.listar);
router.get('/:sku', produtosController.buscarPorSku);

// Rotas protegidas por JWT + Upload de imagem
router.post('/', autenticarToken, upload.single('imagem'), produtosController.criar);
router.put('/:sku', autenticarToken, upload.single('imagem'), produtosController.atualizar);
router.delete('/:sku', autenticarToken, produtosController.remover);

export default router;