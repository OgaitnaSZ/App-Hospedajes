import express from "express";
const router = express.Router();
import { agregarHospedaje, modificarHospedaje, eliminarHospedaje} from "../controllers/admin";
import * as adminValidators from "../validators/admin";

router.post("/admin/hospedajes/agregar", adminValidators.validatorHospedaje, agregarHospedaje);
router.put("/admin/hospedajes/modificar", adminValidators.validatorHospedaje, modificarHospedaje);
router.delete("/admin/hospedajes/eliminar/:id", adminValidators.validatorId, eliminarHospedaje);

export { router };