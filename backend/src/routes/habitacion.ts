import express from "express";
const router = express.Router();
import * as habitacion from "../controllers/habitacion";
import * as validator from "../validators/habitacion";

/**
 * http://localhost:4001/api/hospedaje
 * 
 * Route get hospedajes
 * @swagger
 * /habitacion/hospedaje:
 *     get:
 *         tags:
 *             - habitacion
 *         summary: "Obtener habitaciones disponibles"
 *         description: "Ruta para obtener habitaciones disponibles de un hospedaje"
 *         parameters:
 *          - name: idHospedaje
 *            in: query
 *            description: Id del hospedaje
 *            schema:
 *              type: string
 *          - name: Desde
 *            in: query
 *            description: Fecha cuando inicia la reserva
 *            schema:
 *              type: date
 *          - name: Hasta
 *            in: query
 *            description: Fecha cuando finaliza la reserva
 *            schema:
 *              type: date
 *          - name: Capacidad
 *            in: query
 *            description: Capacidad de personas
 *            schema:
 *              type: number
 *         responses:
 *             '200':
 *                 description: Listado de habitaciones del hospedaje
 *             '404':
 *                 description: No hay habitaciones disponibles con los filtros o el ID del hospedaje es incorrecto
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/hospedaje", validator.validatorHabitaciones, habitacion.getHabitaciones);

export { router };