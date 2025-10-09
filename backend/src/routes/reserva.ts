import express from "express";
const router = express.Router();
import * as reserva from "../controllers/reserva";
import * as validator from "../validators/reserva";
import { authMiddleware } from "../middleware/session";

/**
 * http://localhost:4001/api/reserva
 * 
 * Route create reserva
 * @swagger
 * /reservar-hospedaje:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Reservar hospedaje"
 *         description: "Ruta para reservar hospedaje"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/reservaHospedaje"
 * 
 *         responses:
 *             '201':
 *                 description: Hospedaje reservado con exito
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/reservar-hospedaje", authMiddleware, validator.validatorReservaHospedaje, reserva.reservarHospedaje);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route create reserva
 * @swagger
 * /reservar-actividad:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Reservar actividad"
 *         description: "Ruta para reservar actividad"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/reservaActividad"
 * 
 *         responses:
 *             '201':
 *                 description: Actividad reservada con exito
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/reservar-actividad", authMiddleware, validator.validatorReservaActividad, reserva.reservarActividad);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route create reserva
 * @swagger
 * /cancelar:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Cancelar reserva"
 *         description: "Ruta para cancelar reseva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 * 
 *         responses:
 *             '200':
 *                 description: Reserva pendente de cancelacion
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Reserva no encontrada
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/cancelar", authMiddleware, validator.validatorTipo, reserva.cancelarReserva);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route get reserva
 * @swagger
 * /reserva:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener reserva"
 *         description: "Ruta para obtener reseva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 * 
 *         responses:
 *             '200':
 *                 description: Reserva
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Reserva no encontrada
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/reserva", authMiddleware, validator.validatorTipo, reserva.obtenerReserva);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route get reservas usuario
 * @swagger
 * /reservas-usuario:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener reservas de usuario"
 *         description: "Ruta para obtener resevas de usuario"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 * 
 *         responses:
 *             '200':
 *                 description: Reservas del usuario
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No hay reservas
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/reservas-usuario", authMiddleware, validator.validatorTipo, reserva.obtenerReservasUsuario);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route fechas de reservas
 * @swagger
 * /fechas-ocupadas:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener fechas de reserva"
 *         description: "Ruta para obtener fechas de reservas"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/fechasOcupadas"
 * 
 *         responses:
 *             '200':
 *                 description: Fechas de reservas
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No hay reservas
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/fechas-ocupadas", authMiddleware, validator.validatorTipo, reserva.obtenerFechasOcupadas);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route pay verify
 * @swagger
 * /verificar-pago-hospedaje:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Verificar pago de una reserva"
 *         description: "Ruta para Verificar pago de una reserva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/verificarPago"
 * 
 *         responses:
 *             '200':
 *                 description: Detalles del pago
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No existe el pago
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/verificar-pago-hospedaje", authMiddleware, validator.validatorPago, reserva.verificarPagoHospedaje);

/**
 * http://localhost:4001/api/reserva
 * 
 * Route pay verify
 * @swagger
 * /verificar-pago-actividad:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Verificar pago de una reserva"
 *         description: "Ruta para Verificar pago de una reserva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/verificarPago"
 * 
 *         responses:
 *             '200':
 *                 description: Detalles del pago
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No existe el pago
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/verificar-pago-actividad", authMiddleware, validator.validatorPago, reserva.verificarPagoActividad);

export { router };

