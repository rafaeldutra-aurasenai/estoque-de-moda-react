
import { Router } from "express";
import usuariosController from "../controllers/usuariosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/upload.js";

const router = Router();

router.use(authMiddleware);

router.get("/:id", usuariosController.buscarPorId);

router.put("/:id", usuariosController.atualizar);

router.post(
  "/:id/foto",
  upload.single("foto"),
  usuariosController.enviarFoto
);

router.delete("/:id/foto", usuariosController.removerFoto);

export default router;

