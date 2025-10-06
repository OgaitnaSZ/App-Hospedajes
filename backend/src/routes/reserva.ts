import express from "express";
const router = express.Router();
import { reservarHospedaje, cancelarReserva, obtenerReserva, obtenerReservasUsuario, obtenerFechasOcupadas, reservarActividad } from "../controllers/reserva";

import * as validator from "../validators/reserva";

// Hospedajes
router.post("/reservar-hospedaje", validator.validatorReservaHospedaje, reservarHospedaje);
router.get("/cancelar-reserva/:id", validator.validatorId, cancelarReserva);
router.get("/obtener-reserva/:id", validator.validatorId, obtenerReserva);
router.get("/obtener-reservas-por-usuario", obtenerReservasUsuario);
router.get("/obtener-fechas-ocupadas", obtenerFechasOcupadas);

// Actividades
router.post("/reservar-actividad", reservarActividad);

export { router };

