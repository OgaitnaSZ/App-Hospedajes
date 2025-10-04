import express from "express";
const router = express.Router();
import { uploadMiddleware } from '../utils/handleStorage';
import { subirFotos , getFotos, eliminarFoto } from "../controllers/foto";
import * as fotoValidators from "../validators/foto";

router.post("/subir", uploadMiddleware.array("fotos"), fotoValidators.validatorUploadFoto, subirFotos);
router.get("/hospedaje/:id", fotoValidators.validatorId, getFotos);
router.delete("/eliminar/:id", fotoValidators.validatorId, eliminarFoto);

export { router };