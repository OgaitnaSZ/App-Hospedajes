import express from "express";
const router = express.Router();
import { uploadMiddleware } from '../utils/handleStorage';
import * as foto from "../controllers/foto";
import * as validator from "../validators/foto";
import { authMiddleware } from "../middleware/session";

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

/**
 * http://localhost:4001/api/foto
 * 
 * Route subir fotos
 * @swagger
 * /foto/subir":
 *     post:
 *         tags:
 *             - foto
 *         summary: "Subir fotos de hospedaje"
 *         description: "Ruta para subir fotos de hospedaje"
 *         requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              fotos:
 *                                  type: string
 *                                  format: binary
 *                              idHospedaje:
 *                                  type: string
 *         responses:
 *             '201':
 *                 description: Fotos subidas correctamente
 *             '400':
 *                 description: No se recibieron archivos
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/subir",authMiddleware, uploadMiddleware.array("fotos"), validator.validatorUploadFoto, foto.subirFotos);

/**
 * http://localhost:4001/api/foto
 * 
 * Route eliminar foto
 * @swagger
 * /foto/eliminar/{id}":
 *     delete:
 *         tags:
 *             - foto
 *         summary: "Eliminar foto"
 *         description: "Ruta para eliminar foto"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID de la foto
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Archivo eliminado
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID de foto no valido
 *             '404':
 *                 description: Foto no encontrada en la base de datos
 *             '500':
 *                 description: Error del servidor 
 */
router.delete("/eliminar/:id",authMiddleware, validator.validatorId, foto.eliminarFoto);

export { router };