import express from "express";
const router = express.Router();
import * as servicio from "../controllers/servicio";
import * as validator from "../validators/servicio";

/**
 * http://localhost:4001/api/servicio
 * 
 * Route get servicios
 * @swagger
 * /servicio:
 *     get:
 *         tags:
 *             - servicioo
 *         summary: "Obtener servicios"
 *         description: "Ruta para Obtener servicios de hospedaje o habitacion"
 *         parameters:
 *         - name: tipo
 *           in: path
 *           description: Tipo de servicios
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Listado de servicios
 *             '401':
 *                 descripcion: No inicio session
 *             '403':
 *                 description: Tipo de servicio no valido
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/", validator.validatorServicios, servicio.getServicios);

export { router };