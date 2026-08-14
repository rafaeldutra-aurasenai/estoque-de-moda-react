import { Router } from 'express';
import categoriasController from '../controllers/categoriasController.js';

const router = Router();

router.get('/', categoriasController.listar);

export default router;
