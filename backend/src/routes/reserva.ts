import express from "express";
const router = express.Router();
import { reservarHospedaje, cancelarReserva, obtenerReserva, obtenerReservasUsuario, obtenerFechasOcupadas, reservarActividad } from "../controllers/reserva";

import * as validator from "../validators/reserva";

// Hospedajes
router.post("/reservar-hospedaje", validator.validatorReservaHospedaje, reservarHospedaje);
router.get("/cancelar/:id", validator.validatorId, cancelarReserva);
router.get("/reserva/:id", validator.validatorId, obtenerReserva);
router.get("/reservas-usuario/:id", validator.validatorId, obtenerReservasUsuario);
router.get("/fechas-ocupadas", obtenerFechasOcupadas);

// Actividades
router.post("/reservar-actividad", reservarActividad);

export { router };

