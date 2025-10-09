import express from "express";
const router = express.Router();
import * as user from "../controllers/user";
import * as validator from "../validators/user";
import { authMiddleware } from "../middleware/session";

/**
 * http://localhost:4001/api/user
 * 
 * Route get data user
 * @swagger
 * /user/update-password/{id}":
 *     get:
 *         tags:
 *             - user
 *         summary: "Obtener datos de usuario"
 *         description: "Ruta para Obtener datos de usuario"
 *         security:
 *             - bearerAuth: []
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del usuario
 *           required: true
 *           schema:
 *             type:string
 *         responses:
 *             '200':
 *                 description: Datos del usuario
 *             '400':
 *                 description: ID de usuario no valido
 *             '401':
 *                 descripcion: No inicio session
 *             '404':
 *                 description: Usuario no encontrado
 *             '500':
 *                 description: Error del servidor 
 */
router.get("/get-data/:id", authMiddleware, validator.validatorUserData, user.getData);

/**
 * http://localhost:4001/api/user
 * 
 * Route update user
 * @swagger
 * /user/update-data:
 *      put:
 *          tags:
 *              - user
 *          summary: "Actualizar usuario"
 *          description: "Ruta para actualizar usuario"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userUpdateData"
 *          responses:
 *              '200':
 *                  description: Usuario actualizado 
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Usuario no encontrado
 *              '500':
 *                  description: Error del servidor 
 */
router.put("/update-data", authMiddleware, validator.validatorUserUpdate, user.updateData);

/**
 * http://localhost:4001/api/user
 * 
 * Route suscribe
 * @swagger
 * /user/subscribe-email:
 *     post:
 *         tags:
 *             - user
 *         summary: "Subscribir al newletter"
 *         description: "Ruta para suscribir usuario"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/userSuscribe"
 * 
 *         responses:
 *             '201':
 *                 description: Usuario suscripto
 *             '400':
 *                 description: El email ya está suscrito
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/subscribe-email", validator.validatorSubscribeEmail, user.subscribeEmail);

export { router };