import { Router } from 'express';
import pedidosController from '../controllers/pedidosController.js';

const router = Router();

router.get('/', pedidosController.listar);
router.get('/:id', pedidosController.buscarPorId);
router.post('/', pedidosController.criar);
router.put('/:id/status', pedidosController.atualizarStatus);

export default router;
