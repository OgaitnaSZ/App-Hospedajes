import express from "express";
const router = express.Router();
import { agregarHospedaje, modificarHospedaje, eliminarHospedaje, getHabitaciones, agregarHabitacion, modificarHabitacion, eliminarHabitacion, getActividades, modificarActividad, eliminarActividad, agregarActividad} from "../controllers/admin";
import * as adminValidators from "../validators/admin";
import { authMiddleware } from "../middleware/session";
import { checkRol } from "../middleware/rol";
import { usuario_rol } from "../generated/prisma";

router.use(authMiddleware); // Middleware para todas las rutas
router.use(checkRol([usuario_rol.administrador]));

// Hospedajes
router.post("/hospedajes/agregar", adminValidators.validatorHospedajeNew, agregarHospedaje);
router.put("/hospedajes/modificar", adminValidators.validatorHospedajeUpdate, modificarHospedaje);
router.delete("/hospedajes/eliminar/:id", adminValidators.validatorId, eliminarHospedaje);

// Habitaciones
router.get("/habitaciones/hospedaje/:id", adminValidators.validatorId, getHabitaciones);
router.post("/habitaciones/agregar", adminValidators.validatorHabitacionNew, agregarHabitacion);
router.put("/habitaciones/modificar", adminValidators.validatorHabitacionUpdate, modificarHabitacion);
router.delete("/habitaciones/eliminar/:id", adminValidators.validatorId, eliminarHabitacion);

// Actividades
router.get("/actividades", getActividades);
router.post("/actividades/agregar", adminValidators.validatorActividadNew, agregarActividad);
router.put("/actividades/modificar", adminValidators.validatorActividadUpdate, modificarActividad);
router.delete("/actividades/eliminar/:id", adminValidators.validatorId, eliminarActividad);

export { router };