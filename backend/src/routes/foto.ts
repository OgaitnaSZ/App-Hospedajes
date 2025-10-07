import express from "express";
const router = express.Router();
import { uploadMiddleware } from '../utils/handleStorage';
import * as foto from "../controllers/foto";
import * as validator from "../validators/foto";
import { authMiddleware } from "../middleware/session";

router.get("/hospedaje/:id", validator.validatorId, foto.getFotos);
router.post("/subir",authMiddleware, uploadMiddleware.array("fotos"), validator.validatorUploadFoto, foto.subirFotos);
router.delete("/eliminar/:id",authMiddleware, validator.validatorId, foto.eliminarFoto);

export { router };