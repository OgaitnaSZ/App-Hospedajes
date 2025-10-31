import express from "express";
const router = express.Router();
import * as foto from "../controllers/foto";
import * as validator from "../validators/foto";

/**
 * http://localhost:4001/api/foto
 * 
 * Route get fotos hospedajes
 * @swagger
 * /foto/hospedaje/{id}":
 *     get:
 *         tags:
 *             - foto
 *         summary: "Obtener fotos de hospedaje"
 *         description: "Ruta para Obtener fotos de hospedaje"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del hospedaje
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Fotos del hospedaje
 *             '403':
 *                 description: ID de hospedaje no valido
 *             '404':
 *                 description: No hay fotos para este hospedaje
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/hospedaje/:id", validator.validatorId, foto.getFotos);

export { router };