"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const auth = __importStar(require("../controllers/auth"));
const validator = __importStar(require("../validators/auth"));
const session_1 = require("../middleware/session");
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
 *     put:
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
router.put("/update-password", session_1.authMiddleware, validator.validatorUpdatePassword, auth.updatePassword);
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
//# sourceMappingURL=auth.js.map