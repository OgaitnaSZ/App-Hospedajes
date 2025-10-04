import express from "express";
const router = express.Router();
import { agregarHospedaje, modificarHospedaje, eliminarHospedaje, getHabitaciones, agregarHabitacion, modificarHabitacion, eliminarHabitacion} from "../controllers/admin";
import * as adminValidators from "../validators/admin";

// Hospedajes
router.post("/hospedajes/agregar", adminValidators.validatorHospedajeNew, agregarHospedaje);
router.put("/hospedajes/modificar", adminValidators.validatorHospedajeUpdate, modificarHospedaje);
router.delete("/hospedajes/eliminar/:id", adminValidators.validatorId, eliminarHospedaje);

// Habitaciones
router.get("/habitaciones/hospedaje/:id", adminValidators.validatorId, getHabitaciones);
router.post("/habitaciones/agregar", adminValidators.validatorHabitacionNew, agregarHabitacion);
router.put("/habitaciones/modificar", adminValidators.validatorHabitacionUpdate, modificarHabitacion);
router.delete("/habitaciones/eliminar/:id", adminValidators.validatorId, eliminarHabitacion);

export { router };