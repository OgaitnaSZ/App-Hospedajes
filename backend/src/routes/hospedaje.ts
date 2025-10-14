import express from "express";
const router = express.Router();
import * as hospedaje from "../controllers/hospedaje";
import * as validator from "../validators/hospedaje";

/**
 * http://localhost:4001/api/hospedaje
 * 
 * Route get hospedajes
 * @swagger
 * /hospedaje/hospedajes:
 *     get:
 *         tags:
 *             - hospedaje
 *         summary: "Obtener hospedajes"
 *         description: "Ruta para obtener hospedajes"
 *         parameters:
 *          - name: ciudad
 *            in: query
 *            description: Ciudad de los hospedajes
 *            schema:
 *              type: string
 *          - name: FechaInicio
 *            in: query
 *            description: Fecha cuando inicia la reserva
 *            schema:
 *              type: date
 *          - name: FechaFin
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
 *                 description: Listado de hospedajes
 *             '404':
 *                 description: No hay hospedajes disponibles
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/hospedajes", validator.validatorHospedajesFiltro, hospedaje.getHospedajes);

/**
 * http://localhost:4001/api/hospedaje
 * 
 * Route get hospedaje
 * @swagger
 * /hospedaje/hospedaje/{id}:
 *     get:
 *         tags:
 *             - hospedaje
 *         summary: "Obtener datos de un hospedaje"
 *         description: "Ruta para obtener datos de un hospedaje"
 *         parameters:
 *          - name: id
 *            in: path
 *            description: Id del hospedaje
 *            schema:
 *              type: string
 *         responses:
 *             '200':
 *                 description: Datos del hospedajes
 *             '403':
 *                 description: Formato de ID incorrecto
 *             '404':
 *                 description: No hospedajes asociado a ese id
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/hospedaje/:id", validator.validatorId, hospedaje.getHospedaje);

/**
 * http://localhost:4001/api/hospedaje
 * 
 * Route get hospedajes destacados
 * @swagger
 * /hospedaje/destacados:
 *     get:
 *         tags:
 *             - hospedaje
 *         summary: "Obtener hospedajes destacados"
 *         description: "Ruta para obtener hospedajes destacados"
 *         responses:
 *             '200':
 *                 description: Hospedajes destacados
 *             '404':
 *                 description: No hospedajes destacados
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/destacados",  hospedaje.getHospedajesDestacados);

export { router };