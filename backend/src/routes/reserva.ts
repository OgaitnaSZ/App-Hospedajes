import express from "express";
const router = express.Router();
import * as reserva from "../controllers/reserva";
import * as validator from "../validators/reserva";
import { authMiddleware } from "../middleware/session";

router.post("/reservar-hospedaje", authMiddleware, validator.validatorReservaHospedaje, reserva.reservarHospedaje);
router.post("/reservar-actividad", authMiddleware, validator.validatorReservaActividad, reserva.reservarActividad);

router.post("/cancelar", authMiddleware, validator.validatorTipo, reserva.cancelarReserva);
router.post("/reserva", authMiddleware, validator.validatorTipo, reserva.obtenerReserva);
router.post("/reservas-usuario", authMiddleware, validator.validatorTipo, reserva.obtenerReservasUsuario);
router.post("/fechas-ocupadas", authMiddleware, validator.validatorTipo, reserva.obtenerFechasOcupadas);

router.post("/verificar-pago-hospedaje", authMiddleware, validator.validatorPago, reserva.verificarPagoHospedaje)
router.post("/verificar-pago-actividad", authMiddleware, validator.validatorPago, reserva.verificarPagoActividad)

export { router };

