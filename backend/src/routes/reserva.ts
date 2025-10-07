import express from "express";
const router = express.Router();
import { reservarHospedaje, cancelarReserva, obtenerReserva, obtenerReservasUsuario, obtenerFechasOcupadas, reservarActividad, verificarPagoHospedaje, verificarPagoActividad } from "../controllers/reserva";

import * as validator from "../validators/reserva";

router.post("/reservar-hospedaje", validator.validatorReservaHospedaje, reservarHospedaje);
router.post("/reservar-actividad", validator.validatorReservaActividad, reservarActividad);

router.post("/cancelar", validator.validatorTipo, cancelarReserva);
router.post("/reserva", validator.validatorTipo, obtenerReserva);
router.post("/reservas-usuario", validator.validatorTipo, obtenerReservasUsuario);
router.post("/fechas-ocupadas", validator.validatorTipo, obtenerFechasOcupadas);

router.post("/verificar-pago-hospedaje", validator.validatorPago, verificarPagoHospedaje)
router.post("/verificar-pago-actividad", validator.validatorPago, verificarPagoActividad)

export { router };

