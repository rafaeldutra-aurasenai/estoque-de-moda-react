Configurações
import { Router } from 'express';
import configuracoesController from '../controllers/configuracoesController.js';

const router = Router();

router.get('/:usuarioId', configuracoesController.buscar);
router.put('/:usuarioId', configuracoesController.atualizar);

export default router;