import express from "express";
const router = express.Router();
import * as auth from "../controllers/auth";
import * as validator from "../validators/auth";
import { authMiddleware } from "../middleware/session";

/**
 * http://localhost:4001/api/auth
 * 
 * Route login user
 * @swagger
 * /auth/login:
 *     post:
 *         tags:
 *             - auth
 *         summary: "Iniciar session"
 *         description: "Ruta para iniciar session"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/userLogin"
 * 
 *         responses:
 *             '200':
 *                 description: Datos correctos
 *             '400':
 *                 description: Password invalido
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Usuario no existe 
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/login", validator.validatorLogin, auth.login);

/**
 * http://localhost:4001/api/auth
 * 
 * Route register user
 * @swagger
 * /auth/register:
 *     post:
 *         tags:
 *             - auth
 *         summary: "Registro"
 *         description: "Ruta para registrar usuario"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/userRegister"
 * 
 *         responses:
 *             '201':
 *                 description: Usuario registrado
 *             '400':
 *                 description: Password invalido o email ya existente
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/register", validator.validatorRegister, auth.register);

/**
 * http://localhost:4001/api/auth
 * 
 * Route update password
 * @swagger
 * /auth/update-password:
 *     post:
 *         tags:
 *             - auth
 *         summary: "Actualizar password"
 *         description: "Ruta para actualizar password"
 *         security:
 *             - bearerAuth: []
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/userUpdatePassword"
 * 
 *         responses:
 *             '200':
 *                 description: Password cambiado
 *             '400':
 *                 description: Password invalido
 *             '403':
 *                 description: Datos incorrectos o no hay permisos
 *             '404':
 *                 description: Usuario no encontrado
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/update-password", authMiddleware, validator.validatorUpdatePassword, auth.updatePassword);

/**
 * http://localhost:4001/api/auth
 * 
 * Route recover password
 * @swagger
 * /auth/recover-password:
 *     post:
 *         tags:
 *             - auth
 *         summary: "Recuperar password"
 *         description: "Ruta para recuperar password"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/recoverPassword"
 * 
 *         responses:
 *             '200':
 *                 description: Email enviado
 *             '403':
 *                 description: Formato de email incorrecto
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/recover-password", validator.validatorRecoverPassword, auth.recoverPassword);

/**
 * http://localhost:4001/api/auth
 * 
 * Route reset password
 * @swagger
 * /auth/reset-password:
 *     post:
 *         tags:
 *             - auth
 *         summary: "Resetear password"
 *         description: "Ruta para Resetear password"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/resetPassword"
 * 
 *         responses:
 *             '200':
 *                 description: Password cambiado
 *             '400':
 *                 description: Token inválido o expirado
 *             '403':
 *                 description: Formato incorrecto
 *             '500':
 *                 description: Error del servidor 
 */
router.post("/reset-password", validator.validatorResetPassword, auth.resetPassword);

export { router };
