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
const servicio = __importStar(require("../controllers/servicio"));
const validator = __importStar(require("../validators/servicio"));
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
//# sourceMappingURL=servicio.js.map