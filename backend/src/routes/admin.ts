import express from "express";
const router = express.Router();
import * as admin from "../controllers/admin";
import * as validator from "../validators/admin";
import { authMiddleware } from "../middleware/session";
import { checkRol } from "../middleware/rol";
import { usuario_rol } from "../generated/prisma";

router.use(authMiddleware); // Middleware para todas las rutas
router.use(checkRol([usuario_rol.administrador]));

// Hospedajes
router.post("/hospedajes/agregar", validator.validatorHospedajeNew, admin.agregarHospedaje);
router.put("/hospedajes/modificar", validator.validatorHospedajeUpdate, admin.modificarHospedaje);
router.delete("/hospedajes/eliminar/:id", validator.validatorId, admin.eliminarHospedaje);

// Habitaciones
router.get("/habitaciones/hospedaje/:id", validator.validatorId, admin.getHabitaciones);
router.post("/habitaciones/agregar", validator.validatorHabitacionNew, admin.agregarHabitacion);
router.put("/habitaciones/modificar", validator.validatorHabitacionUpdate, admin.modificarHabitacion);
router.delete("/habitaciones/eliminar/:id", validator.validatorId, admin.eliminarHabitacion);

// Actividades
router.get("/actividades", admin.getActividades);
router.post("/actividades/agregar", validator.validatorActividadNew, admin.agregarActividad);
router.put("/actividades/modificar", validator.validatorActividadUpdate, admin.modificarActividad);
router.delete("/actividades/eliminar/:id", validator.validatorId, admin.eliminarActividad);

export { router };