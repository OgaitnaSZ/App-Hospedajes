import express from "express";
const router = express.Router();
import * as resena from "../controllers/resena";
import * as validator from "../validators/resena";
import { authMiddleware } from "../middleware/session";

/**
 * http://localhost:4001/api/resena
 * 
 * Route create resena
 * @swagger
 * /resena/agregar:
 *     post:
 *         tags:
 *             - resena
 *         summary: "Agregar reseña"
 *         description: "Ruta para agregar reseña"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/resenaNew"
 * 
 *         responses:
 *             '201':
 *                 description: Reseña agregada
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/agregar",authMiddleware, validator.validatorUploadResenas, resena.crearResena);

/**
 * http://localhost:4001/api/resena
 * 
 * Route create resena
 * @swagger
 * /resena/actualizar:
 *     put:
 *         tags:
 *             - resena
 *         summary: "Actualizar reseña"
 *         description: "Ruta para actualizar reseña"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/resenaUpdate"
 * 
 *         responses:
 *             '200':
 *                 description: Reseña actualizada
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Resena no encontrada
 *             '500':
 *                 description: Error del servidor 
 */
router.put("/actualizar",authMiddleware, validator.validatorUpdateResenas, resena.actualizarResena);

/**
 * http://localhost:4001/api/resena
 * 
 * Obtener reseñas de una reserva de un usuario
 * @swagger
 * /resena/usuario/{idUsuario}/hospedaje/{idHospedaje}/habitacion/{idHabitacion}:
 *     get:
 *         tags:
 *             - resena
 *         summary: "Obtener reseñas de un hospedaje de un usuario"
 *         description: "Ruta para ver reseñas de un hospedaje de un usuario"
 *         parameters:
 *         - name: idUsuario
 *           in: path
 *           description: ID del usuario
 *           required: true
 *           schema:
 *             type:string
 *         - name: idHospedaje
 *           in: path
 *           description: ID del hospedaje
 *           required: true
 *           schema:
 *             type:string
 *         - name: idHabitacion
 *           in: path
 *           description: ID de la habitacion
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Listado de reseñas
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Resena no encontrada
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/usuario/:idUsuario/hospedaje/:idHospedaje/habitacion/:idHabitacion",authMiddleware, validator.validatorGetResenas, resena.getResenasUsuario);

/**
 * http://localhost:4001/api/resena
 * 
 * Obtener reseñas de una reserva de un hospedaje
 * @swagger
 * /resena/hospedaje/{id}:
 *     get:
 *         tags:
 *             - resena
 *         summary: "Obtener reseñas de un hospedaje"
 *         description: "Ruta para ver reseñas de un hospedaje"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del hospedaje
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Listado de reseñas
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No existe el hospedaje o no hay reseñas
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/hospedaje/:id", validator.validatorId, resena.getResenasHospedaje);

/**
 * http://localhost:4001/api/resena
 * 
 * Obtener mejores reseñas
 * @swagger
 * /resena/mejores/{cantidad}:
 *     get:
 *         tags:
 *             - resena
 *         summary: "Obtener reseñas de 5 y 4 estrellas"
 *         description: "Ruta para ver reseñas mejor valoradas"
 *         parameters:
 *         - name: cantidad
 *           in: query
 *           description: cantidad de reseñas a devolver
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Listado de reseñas
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No hay reseñas
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/mejores/:cantidad", validator.validatorCantidad, resena.getMejoresResenas);

/**
 * http://localhost:4001/api/resena
 * 
 * Eliminar reseña
 * @swagger
 * /resena/eliminar/{id}:
 *     get:
 *         tags:
 *             - resena
 *         summary: "Eliminar reseña"
 *         description: "Ruta para eliminar reseña"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: id de reseña a eliminar
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Reseña eliminada correctamente
 *             '401':
 *                 description: No inicio session o no es tu reseña
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Reseña no existe
 *             '500':
 *                 description: Error del servidor 
 */
router.delete("/eliminar/:id",authMiddleware, validator.validatorId, resena.eliminarResena);

export { router };