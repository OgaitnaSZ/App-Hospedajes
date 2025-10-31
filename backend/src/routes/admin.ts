import express from "express";
const router = express.Router();
import * as admin from "../controllers/admin";
import * as validator from "../validators/admin";
import { authMiddleware } from "../middleware/session";
import { checkRol } from "../middleware/rol";
import { usuario_rol } from "../generated/prisma";
import { uploadMiddleware } from "../utils/handleStorage";

router.use(authMiddleware); // Middleware para todas las rutas
router.use(checkRol([usuario_rol.administrador]));

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
router.post("/foto/subir", authMiddleware, uploadMiddleware.array("fotos"), validator.validatorUploadFoto, admin.subirFotos);

/**
 * http://localhost:4001/api/admin
 * 
 * Route seleccionar imagen principal
 * @swagger
 * /admin/foto/seleccionarPrincipal":
 *     patch:
 *         tags:
 *             - foto
 *         summary: "Seleccionar imagen principal"
 *         description: "Ruta para seleccionar imagen principal"
 *         requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              idHospedaje:
 *                                  type: string
 *                              idFoto:
 *                                  type: string
 *         responses:
 *             '200':
 *                 description: Foto principal actualizada
 *             '401':
 *                 description: No inicio session o no es administrador
 *             '403':
 *                 description: ID del hospedaje o ID de la foto no valida
 *             '404':
 *                 description: Hospedaje o Foto no encontrada en la base de datos
 *             '500':
 *                 description: Error del servidor 
 */
router.patch("/foto/seleccionarPrincipal", validator.validatorSelectFoto, admin.seleccionarPrincipal);

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
router.delete("/foto/eliminar/:id",authMiddleware, validator.validatorId, admin.eliminarFoto);

export { router };