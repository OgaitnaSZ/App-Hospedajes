import express from "express";
const router = express.Router();
import * as resena from "../controllers/resena";
import * as validator from "../validators/resena";
import { authMiddleware } from "../middleware/session";

router.post("/agregar",authMiddleware, validator.validatorUploadResenas, resena.crearResena);
router.put("/actualizar",authMiddleware, validator.validatorUpdateResenas, resena.actualizarResena);
router.get("/usuario/:idUsuario/hospedaje/:idHospedaje/habitacion/:idHabitacion",authMiddleware, validator.validatorGetResenas, resena.getResenasUsuario);
router.get("/mejores/:cantidad", validator.validatorCantidad, resena.getMejoresResenas);
router.delete("/eliminar/:id",authMiddleware, validator.validatorId, resena.eliminarResena);

export { router };