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
const admin = __importStar(require("../controllers/admin"));
const validator = __importStar(require("../validators/admin"));
const session_1 = require("../middleware/session");
const rol_1 = require("../middleware/rol");
const prisma_1 = require("../generated/prisma");
const handleStorage_1 = require("../utils/handleStorage");
router.use(session_1.authMiddleware); // Middleware para todas las rutas
router.use((0, rol_1.checkRol)([prisma_1.usuario_rol.administrador]));
/**
 * http://localhost:4001/api/admin
 *
 * Route get habitaciones hospedaje
 * @swagger
 * /admin/hospedajes/hospedajes:
 *     get:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Obtener habitaciones del hospedaje"
 *         description: "Ruta para obtener habitaciones de un hospedaje"
 *         responses:
 *             '200':
 *                 description: Listado de hospedajes
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '404':
 *                 description: No hay hospedajes
 *             '500':
 *                 description: Error del servidor
 */
router.get("/hospedajes/hospedajes", admin.getHospedajes);
/**
 * http://localhost:4001/api/admin
 *
 * Route get habitaciones hospedaje
 * @swagger
 * /admin/hospedajes/hospedaje:
 *     get:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Obtener un hospedaje"
 *         description: "Ruta para obtener un hospedaje"
 *         responses:
 *             '200':
 *                 description: Datos de hospedaje
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '404':
 *                 description: No existe hospedaje
 *             '500':
 *                 description: Error del servidor
 */
router.get("/hospedajes/hospedaje/:id", admin.getHospedaje);
/**
 * http://localhost:4001/api/admin
 *
 * Route create hospedaje
 * @swagger
 * /admin/hospedajes/agregar:
 *     post:
 *         tags:
 *             - admin
 *             - hospedaje
 *         summary: "Agregar hospedaje"
 *         description: "Ruta para agregar hospedaje"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/hospedajeNew"
 *
 *         responses:
 *             '201':
 *                 description: Hospedaje creado con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor
 */
router.post("/hospedajes/agregar", validator.validatorHospedajeNew, admin.agregarHospedaje);
/**
 * http://localhost:4001/api/admin
 *
 * Route modify hospedaje
 * @swagger
 * /admin/hospedajes/modificar:
 *     post:
 *         tags:
 *             - admin
 *             - hospedaje
 *         summary: "Modificar hospedaje"
 *         description: "Ruta para modificar hospedaje"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/hospedajeUpdate"
 *
 *         responses:
 *             '200':
 *                 description: Hospedaje modificado con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: ID del hospedaje incorrecto
 *             '500':
 *                 description: Error del servidor
 */
router.put("/hospedajes/modificar", validator.validatorHospedajeUpdate, admin.modificarHospedaje);
/**
 * http://localhost:4001/api/admin
 *
 * Route toggle estado hospedaje
 * @swagger
 * /admin/hospedajes/cambiarEstado/{id}:
 *     patch:
 *         tags:
 *             - admin
 *             - hospedaje
 *         summary: "Cambiar estado de hospedaje"
 *         description: "Ruta para cambiar estado del hospedaje"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del hospedaje
 *           required: true
 *           schema:
 *             type:string
 *
 *         responses:
 *             '200':
 *                 description: Estado de hospedaje actualizado
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID del hospedaje no valido
 *             '404':
 *                 description: Hospedaje no encontrado en la base de datos
 *             '500':
 *                 description: Error del servidor
 */
router.patch("/hospedajes/cambiarEstado/:id", validator.validatorId, admin.toggleEstadoHospedaje);
/**
 * http://localhost:4001/api/admin
 *
 * Route delete hospedaje
 * @swagger
 * /admin/hospedajes/eliminar/{id}:
 *     patch:
 *         tags:
 *             - admin
 *             - hospedaje
 *         summary: "Eliminar hospedaje"
 *         description: "Ruta para eliminar hospedaje"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del hospedaje
 *           required: true
 *           schema:
 *             type:string
 *
 *         responses:
 *             '200':
 *                 description: Hospedaje eliminado
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID del hospedaje no valido
 *             '404':
 *                 description: Hospedaje no encontrado en la base de datos
 *             '500':
 *                 description: Error del servidor
 */
router.patch("/hospedajes/eliminar/:id", validator.validatorId, admin.eliminarHospedaje);
/**
 * http://localhost:4001/api/admin
 *
 * Route get habitaciones hospedaje
 * @swagger
 * /admin/habitacion/hospedaje:
 *     get:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Obtener habitaciones del hospedaje"
 *         description: "Ruta para obtener habitaciones de un hospedaje"
 *         parameters:
 *          - name: id
 *            in: path
 *            description: Id del hospedaje
 *            schema:
 *              type: string
 *         responses:
 *             '200':
 *                 description: Listado de habitaciones del hospedaje
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '404':
 *                 description: No hay habitaciones del hospedaje
 *             '500':
 *                 description: Error del servidor
 */
router.get("/habitaciones/hospedaje/:id", validator.validatorId, admin.getHabitaciones);
/**
 * http://localhost:4001/api/admin
 *
 * Route create habitacion
 * @swagger
 * /admin/habitaciones/agregar:
 *     post:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Agregar habitacion"
 *         description: "Ruta para agregar habitacion"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/habitacionNew"
 *
 *         responses:
 *             '201':
 *                 description: Habitacion creada con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor
 */
router.post("/habitaciones/agregar", validator.validatorHabitacionNew, admin.agregarHabitacion);
/**
 * http://localhost:4001/api/admin
 *
 * Route modify habitacion
 * @swagger
 * /admin/habitaciones/agregar:
 *     put:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Agregar habitacion"
 *         description: "Ruta para agregar habitacion"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/habitacionUpdate"
 *
 *         responses:
 *             '200':
 *                 description: Habitacion creada con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Habitacion no encontrada
 *             '500':
 *                 description: Error del servidor
 */
router.put("/habitaciones/modificar", validator.validatorHabitacionUpdate, admin.modificarHabitacion);
/**
 * http://localhost:4001/api/admin
 *
 * Route delete habitacion
 * @swagger
 * /admin/habitacions/eliminar/{id}:
 *     delete:
 *         tags:
 *             - admin
 *             - habitacion
 *         summary: "Eliminar habitacion"
 *         description: "Ruta para eliminar habitacion"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del habitacion
 *           required: true
 *           schema:
 *             type:string
 *
 *         responses:
 *             '200':
 *                 description: Habitacion eliminada
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID de habitacion no valido
 *             '500':
 *                 description: Error del servidor
 */
router.delete("/habitaciones/eliminar/:id", validator.validatorId, admin.eliminarHabitacion);
/**
 * http://localhost:4001/api/admin
 *
 * Route get actividades
 * @swagger
 * /admin/actividades:
 *     get:
 *         tags:
 *             - admin
 *             - actividad
 *         summary: "Obtener actividades"
 *         description: "Ruta para obtener actividades"
 *         responses:
 *             '200':
 *                 description: Listado de actividades
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '404':
 *                 description: No hay actividades
 *             '500':
 *                 description: Error del servidor
 */
router.get("/actividades", admin.getActividades);
/**
 * http://localhost:4001/api/admin
 *
 * Route create actividad
 * @swagger
 * /admin/actividades/agregar:
 *     post:
 *         tags:
 *             - admin
 *             - actividad
 *         summary: "Agregar actividad"
 *         description: "Ruta para agregar actividad"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/actividadNew"
 *
 *         responses:
 *             '201':
 *                 description: actividad creada con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '500':
 *                 description: Error del servidor
 */
router.post("/actividades/agregar", validator.validatorActividadNew, admin.agregarActividad);
/**
 * http://localhost:4001/api/admin
 *
 * Route modify actividad
 * @swagger
 * /admin/actividades/modificar:
 *     put:
 *         tags:
 *             - admin
 *             - actividad
 *         summary: "Modificar actividad"
 *         description: "Ruta para modificar actividad"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: "#/components/schemas/actividadUpdate"
 *
 *         responses:
 *             '201':
 *                 description: actividad creada con exito
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Datos incorrectos
 *             '404':
 *                 description: Actividad no encontrada
 *             '500':
 *                 description: Error del servidor
 */
router.put("/actividades/modificar", validator.validatorActividadUpdate, admin.modificarActividad);
/**
 * http://localhost:4001/api/admin
 *
 * Route delete activity
 * @swagger
 * /admin/actividades/eliminar/{id}:
 *     delete:
 *         tags:
 *             - admin
 *             - actividad
 *         summary: "Eliminar actividad"
 *         description: "Ruta para eliminar actividad"
 *         parameters:
 *         - name: id
 *           in: path
 *           description: ID del actividad
 *           required: true
 *           schema:
 *             type:string
 *
 *         responses:
 *             '200':
 *                 description: Actividad eliminada
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID de actividad no valido
 *             '500':
 *                 description: Error del servidor
 */
router.delete("/actividades/eliminar/:id", validator.validatorId, admin.eliminarActividad);
/**
 * http://localhost:4001/api/admin
 *
 * Route subir fotos
 * @swagger
 * /admin/foto/subir":
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
 *             '404':
 *                 description: Hospedaje no existe
 *             '500':
 *                 description: Error del servidor
 */
router.post("/foto/subir", handleStorage_1.uploadMiddleware, validator.validatorUploadFoto, admin.subirFotos);
/**
 * http://localhost:4001/api/admin
 *
 * Route Actualizar orden de fotos
 * @swagger
 * /admin/foto/seleccionarPrincipal":
 *     patch:
 *         tags:
 *             - foto
 *         summary: "Actualizar orden de fotos"
 *         description: "Ruta para Actualizar orden de fotos"
 *         requestBody:
 *             content:
 *                 application/json:
 *                     schema:
 *                         fotos
 *         responses:
 *             '200':
 *                 description: Orden actualizada
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: Fotos no validas
 *             '404':
 *                 description: Hospedaje o Foto no encontrada en la base de datos
 *             '500':
 *                 description: Error del servidor
 */
router.patch("/foto/actualizarOrden", validator.validatorUpdateOrder, admin.actualizarOrden);
/**
 * http://localhost:4001/api/admin
 *
 * Route eliminar foto
 * @swagger
 * /admin/foto/eliminar/{id}":
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
router.delete("/foto/eliminar/:id", validator.validatorId, admin.eliminarFoto);
//# sourceMappingURL=admin.js.map