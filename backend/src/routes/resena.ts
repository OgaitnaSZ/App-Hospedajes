import express from "express";
const router = express.Router();
import { crearResena , actualizarResena, getResenasUsuario, getMejoresResenas, eliminarResena } from "../controllers/resena";
import * as validator from "../validators/resena";
import { authMiddleware } from "../middleware/session";

router.post("/agregar",authMiddleware, validator.validatorUploadResenas, crearResena);
router.put("/actualizar",authMiddleware, validator.validatorUpdateResenas, actualizarResena);
router.get("/usuario/:idUsuario/hospedaje/:idHospedaje/habitacion/:idHabitacion",authMiddleware, validator.validatorGetResenas, getResenasUsuario);
router.get("/mejores/:cantidad",authMiddleware, validator.validatorCantidad, getMejoresResenas);
router.delete("/eliminar/:id",authMiddleware, validator.validatorId, eliminarResena);

export { router };