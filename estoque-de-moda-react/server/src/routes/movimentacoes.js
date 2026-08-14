import { Router } from 'express';
import movimentacoesController from '../controllers/movimentacoesController.js';

const router = Router();

router.get('/', movimentacoesController.listar);
router.post('/', movimentacoesController.registrar);

export default router;
