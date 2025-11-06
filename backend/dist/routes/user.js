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
const user = __importStar(require("../controllers/user"));
const validator = __importStar(require("../validators/user"));
const session_1 = require("../middleware/session");
/**
 * http://localhost:4001/api/user
 *
 * Route get data user
 * @swagger
 * /user/get-data/{id}":
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
 *             '403':
 *                 descripcion: No hay permisos
 *             '404':
 *                 description: Usuario no encontrado
 *             '500':
 *                 description: Error del servidor
 */
router.get("/get-data/:id", session_1.authMiddleware, validator.validatorUserData, user.getData);
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
 *              '403':
 *                  description: Formato incorrecto o no hay permisos
 *              '404':
 *                  description: Usuario no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.put("/update-data", session_1.authMiddleware, validator.validatorUserUpdate, user.updateData);
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
 *             '403':
 *                 description: Formato de email incorrcto
 *             '500':
 *                 description: Error del servidor
 */
router.post("/subscribe-email", validator.validatorSubscribeEmail, user.subscribeEmail);
//# sourceMappingURL=user.js.map