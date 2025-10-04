import express from "express";
const router = express.Router();
import { agregarHospedaje, modificarHospedaje, eliminarHospedaje} from "../controllers/admin";
import * as adminValidators from "../validators/admin";

router.post("/hospedajes/agregar", adminValidators.validatorHospedajeNew, agregarHospedaje);
router.put("/hospedajes/modificar", adminValidators.validatorHospedajeUpdate, modificarHospedaje);
router.delete("/hospedajes/eliminar/:id", adminValidators.validatorId, eliminarHospedaje);

export { router };