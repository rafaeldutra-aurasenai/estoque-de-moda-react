import { Router } from "express";
import configuracoesController from "../controllers/configuracoesController.js";

const router = Router();

router.get("/", configuracoesController.buscar);
router.put("/", configuracoesController.atualizar);

export default router;