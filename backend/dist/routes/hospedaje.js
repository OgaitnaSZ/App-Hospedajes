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
const hospedaje = __importStar(require("../controllers/hospedaje"));
const validator = __importStar(require("../validators/hospedaje"));
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
router.get("/hospedaje/:id", validator.validatorId, hospedaje.getHospedajeDetalle);
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
router.get("/destacados", hospedaje.getHospedajesDestacados);
//# sourceMappingURL=hospedaje.js.map