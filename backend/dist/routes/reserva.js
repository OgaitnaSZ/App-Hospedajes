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
const reserva = __importStar(require("../controllers/reserva"));
const validator = __importStar(require("../validators/reserva"));
const session_1 = require("../middleware/session");
/**
 * http://localhost:4001/api/reserva
 *
 * Route create reserva
 * @swagger
 * /reservar-hospedaje:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Reservar hospedaje"
 *         description: "Ruta para reservar hospedaje"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/reservaHospedaje"
 *
 *         responses:
 *             '201':
 *                 description: Hospedaje reservado con exito
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor
 */
router.post("/reservar-hospedaje", session_1.authMiddleware, validator.validatorReservaHospedaje, reserva.reservarHospedaje);
/**
 * http://localhost:4001/api/reserva
 *
 * Route create reserva
 * @swagger
 * /reservar-actividad:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Reservar actividad"
 *         description: "Ruta para reservar actividad"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/reservaActividad"
 *
 *         responses:
 *             '201':
 *                 description: Actividad reservada con exito
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor
 */
router.post("/reservar-actividad", session_1.authMiddleware, validator.validatorReservaActividad, reserva.reservarActividad);
/**
 * http://localhost:4001/api/reserva
 *
 * Route create reserva
 * @swagger
 * /cancelar:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Cancelar reserva"
 *         description: "Ruta para cancelar reseva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 *
 *         responses:
 *             '200':
 *                 description: Reserva pendente de cancelacion
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Reserva no encontrada
 *             '500':
 *                 description: Error del servidor
 */
router.post("/cancelar", session_1.authMiddleware, validator.validatorTipo, reserva.cancelarReserva);
/**
 * http://localhost:4001/api/reserva
 *
 * Route get reserva
 * @swagger
 * /reserva:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener reserva"
 *         description: "Ruta para obtener reseva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 *
 *         responses:
 *             '200':
 *                 description: Reserva
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Reserva no encontrada
 *             '500':
 *                 description: Error del servidor
 */
router.post("/reserva", session_1.authMiddleware, validator.validatorTipo, reserva.obtenerReserva);
/**
 * http://localhost:4001/api/reserva
 *
 * Route get reservas usuario
 * @swagger
 * /reservas-usuario:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener reservas de usuario"
 *         description: "Ruta para obtener resevas de usuario"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/tipoReserva"
 *
 *         responses:
 *             '200':
 *                 description: Reservas del usuario
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No hay reservas
 *             '500':
 *                 description: Error del servidor
 */
router.post("/reservas-usuario", session_1.authMiddleware, validator.validatorTipo, reserva.obtenerReservasUsuario);
/**
 * http://localhost:4001/api/reserva
 *
 * Route fechas de reservas
 * @swagger
 * /fechas-ocupadas:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Obtener fechas de reserva"
 *         description: "Ruta para obtener fechas de reservas"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/fechasOcupadas"
 *
 *         responses:
 *             '200':
 *                 description: Fechas de reservas
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No hay reservas
 *             '500':
 *                 description: Error del servidor
 */
router.post("/fechas-ocupadas", session_1.authMiddleware, validator.validatorTipo, reserva.obtenerFechasOcupadas);
/**
 * http://localhost:4001/api/reserva
 *
 * Route pay verify
 * @swagger
 * /verificar-pago-hospedaje:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Verificar pago de una reserva"
 *         description: "Ruta para Verificar pago de una reserva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/verificarPago"
 *
 *         responses:
 *             '200':
 *                 description: Detalles del pago
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No existe el pago
 *             '500':
 *                 description: Error del servidor
 */
router.post("/verificar-pago-hospedaje", session_1.authMiddleware, validator.validatorPago, reserva.verificarPagoHospedaje);
/**
 * http://localhost:4001/api/reserva
 *
 * Route pay verify
 * @swagger
 * /verificar-pago-actividad:
 *     post:
 *         tags:
 *             - reserva
 *         summary: "Verificar pago de una reserva"
 *         description: "Ruta para Verificar pago de una reserva"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/verificarPago"
 *
 *         responses:
 *             '200':
 *                 description: Detalles del pago
 *             '401':
 *                 description: No inicio session
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: No existe el pago
 *             '500':
 *                 description: Error del servidor
 */
router.post("/verificar-pago-actividad", session_1.authMiddleware, validator.validatorPago, reserva.verificarPagoActividad);
//# sourceMappingURL=reserva.js.map