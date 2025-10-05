import express from "express";
const router = express.Router();
import { uploadMiddleware } from '../utils/handleStorage';
import { subirFotos , getFotos, eliminarFoto } from "../controllers/foto";
import * as fotoValidators from "../validators/foto";
import { authMiddleware } from "../middleware/session";

router.post("/subir",authMiddleware, uploadMiddleware.array("fotos"), fotoValidators.validatorUploadFoto, subirFotos);
router.get("/hospedaje/:id",authMiddleware, fotoValidators.validatorId, getFotos);
router.delete("/eliminar/:id",authMiddleware, fotoValidators.validatorId, eliminarFoto);

export { router };