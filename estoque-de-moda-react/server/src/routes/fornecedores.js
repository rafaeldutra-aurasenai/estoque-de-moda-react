import { Router } from 'express';
import fornecedoresController from '../controllers/fornecedoresController.js';

const router = Router();

router.get('/', fornecedoresController.listar);
router.get('/:id', fornecedoresController.buscarPorId);
router.post('/', fornecedoresController.criar);
router.put('/:id', fornecedoresController.atualizar);
router.delete('/:id', fornecedoresController.remover);

export default router;
