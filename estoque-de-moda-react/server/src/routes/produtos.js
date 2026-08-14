import { Router } from 'express';
import produtosController from '../controllers/produtosController.js';

const router = Router();

router.get('/', produtosController.listar);
router.get('/:sku', produtosController.buscarPorSku);
router.post('/', produtosController.criar);
router.put('/:sku', produtosController.atualizar);
router.delete('/:sku', produtosController.remover);

export default router;
