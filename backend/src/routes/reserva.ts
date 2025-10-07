import express from "express";
const router = express.Router();
import { reservarHospedaje, cancelarReserva, obtenerReserva, obtenerReservasUsuario, obtenerFechasOcupadas, reservarActividad } from "../controllers/reserva";

import * as validator from "../validators/reserva";

router.post("/reservar-hospedaje", validator.validatorReservaHospedaje, reservarHospedaje);
router.post("/reservar-actividad", validator.validatorReservaActividad, reservarActividad);

router.post("/cancelar", validator.validatorTipo, cancelarReserva);
router.post("/reserva", validator.validatorTipo, obtenerReserva);
router.post("/reservas-usuario", validator.validatorTipo, obtenerReservasUsuario);
router.post("/fechas-ocupadas", validator.validatorTipo, obtenerFechasOcupadas);

export { router };

