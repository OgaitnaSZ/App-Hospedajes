"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHospedajes = getHospedajes;
exports.getHospedaje = getHospedaje;
exports.agregarHospedaje = agregarHospedaje;
exports.modificarHospedaje = modificarHospedaje;
exports.toggleEstadoHospedaje = toggleEstadoHospedaje;
exports.eliminarHospedaje = eliminarHospedaje;
exports.getHabitaciones = getHabitaciones;
exports.agregarHabitacion = agregarHabitacion;
exports.modificarHabitacion = modificarHabitacion;
exports.eliminarHabitacion = eliminarHabitacion;
exports.getActividades = getActividades;
exports.agregarActividad = agregarActividad;
exports.modificarActividad = modificarActividad;
exports.eliminarActividad = eliminarActividad;
exports.subirFotos = subirFotos;
exports.actualizarOrden = actualizarOrden;
exports.eliminarFoto = eliminarFoto;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("../generated/prisma");
const express_validator_1 = require("express-validator");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
const MEDIA_PATH = `${__dirname}/../uploads`;
const PUBLIC_URL = process.env.PUBLIC_URL;
// Hospedajes
function getHospedajes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hospedajes = yield prisma.hospedaje.findMany({
                where: { estado: { not: prisma_1.hospedaje_estado.eliminado } },
                include: {
                    fotos: {
                        orderBy: { sort: 'asc' },
                        take: 1,
                    },
                }
            });
            if (hospedajes.length > 0) {
                const data = hospedajes.map(h => {
                    var _a, _b, _c;
                    return (Object.assign(Object.assign({}, h), { fotos: (_c = (_b = (_a = h.fotos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null }));
                });
                res.status(200).json(data);
            }
            else {
                return res.status(404).send("No se encontraron hospedajes.");
            }
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedajes", 500);
            return;
        }
    });
}
function getHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const idHospedaje = data.id;
            const hospedaje = yield prisma.hospedaje.findUnique({
                where: {
                    estado: { not: prisma_1.hospedaje_estado.eliminado },
                    idHospedaje
                }
            });
            // Obtener habitaciones
            const habitaciones = yield prisma.habitaciones.findMany({
                where: { idHospedaje }
            });
            // Obtener fotos
            const fotos = yield prisma.fotos.findMany({
                where: { idHospedaje },
                orderBy: {
                    sort: 'asc'
                }
            });
            if (hospedaje) {
                res.status(200).json(Object.assign(Object.assign({}, hospedaje), { habitaciones, fotos }));
            }
            else {
                return res.status(404).send("No se encontraron hospedajes.");
            }
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedaje", 500);
            return;
        }
    });
}
function agregarHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataHospedaje = (0, express_validator_1.matchedData)(req);
            const nuevoHospedaje = yield prisma.hospedaje.create({
                data: {
                    titulo: String(dataHospedaje.titulo),
                    descripcion: String(dataHospedaje.descripcion),
                    servicios: String(dataHospedaje.servicios),
                    estrellas: Number(dataHospedaje.estrellas),
                    telefono: String(dataHospedaje.telefono),
                    ciudad: String(dataHospedaje.ciudad),
                    direccion: String(dataHospedaje.direccion),
                    coordenadas: String(dataHospedaje.coordenadas),
                    destacado: false
                }
            });
            return res.status(201).json(nuevoHospedaje);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al crear hospedaje", 500);
            return;
        }
    });
}
function modificarHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataHospedaje = (0, express_validator_1.matchedData)(req);
            const hospedajeExistente = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(dataHospedaje.idHospedaje) }
            });
            if (!hospedajeExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            }
            const updatedHospedaje = yield prisma.hospedaje.update({
                where: { idHospedaje: String(dataHospedaje.idHospedaje) },
                data: {
                    titulo: String(dataHospedaje.titulo),
                    descripcion: String(dataHospedaje.descripcion),
                    servicios: String(dataHospedaje.servicios),
                    estrellas: Number(dataHospedaje.estrellas),
                    telefono: String(dataHospedaje.telefono),
                    ciudad: String(dataHospedaje.ciudad),
                    direccion: String(dataHospedaje.direccion),
                    coordenadas: String(dataHospedaje.coordenadas),
                    destacado: false
                }
            });
            res.status(200).json(updatedHospedaje);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener datos del hospedaje", 500);
            return;
        }
    });
}
function toggleEstadoHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const hospedaje = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(id) }
            });
            if (!hospedaje) {
                (0, handleError_1.handleHttpError)(res, "No se encuentra el hospedaje", 404);
                return;
            }
            // Cambiar estado
            const nuevoEstado = hospedaje.estado === prisma_1.hospedaje_estado.activo
                ? prisma_1.hospedaje_estado.desactivado
                : prisma_1.hospedaje_estado.activo;
            yield prisma.hospedaje.update({
                where: { idHospedaje: String(id) },
                data: { estado: nuevoEstado },
            });
            res.status(200).json({ success: true, message: 'Estado cambiado correctamente' });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar eliminar el hospedaje", 500);
            return;
        }
    });
}
function eliminarHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const hospedaje = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(id) }
            });
            if (!hospedaje) {
                (0, handleError_1.handleHttpError)(res, "No se encuentra el hospedaje", 404);
                return;
            }
            // Eliminar imagenes del servidor
            yield eliminarImagenesPorHospedaje(String(id), res);
            // Eliminar las habitaciones asociadas al IdHospedaje
            // Eliminar el hospedaje
            yield prisma.hospedaje.update({
                where: { idHospedaje: String(id) },
                data: { estado: 'eliminado' }
            });
            res.status(200).json({ success: true, message: 'Hospedaje eliminado exitosamente' });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar eliminar el hospedaje", 500);
            return;
        }
    });
}
// Habitaciones
function getHabitaciones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const IdHospedaje = data.id;
            const habitacionExistente = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(IdHospedaje) }
            });
            if (!habitacionExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            }
            const habitaciones = yield prisma.habitaciones.findMany({
                where: { idHospedaje: IdHospedaje }
            });
            if (habitaciones.length > 0) {
                res.status(200).json(habitaciones);
            }
            else {
                return res.status(404).send("No se encontraron habitaciones para este hospedaje.");
            }
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener habitaciones", 500);
            return;
        }
    });
}
function agregarHabitacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataHabitacion = (0, express_validator_1.matchedData)(req);
            const hospedajeExistente = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(dataHabitacion.idHospedaje) }
            });
            if (!hospedajeExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            }
            const nuevaHabitacion = yield prisma.habitaciones.create({
                data: {
                    idHospedaje: String(dataHabitacion.idHospedaje),
                    numero: String(dataHabitacion.numero),
                    tipo: dataHabitacion.tipo,
                    precio: Number(dataHabitacion.precio),
                    capacidad: Number(dataHabitacion.capacidad),
                    servicios: String(dataHabitacion.servicios)
                }
            });
            return res.status(201).json(nuevaHabitacion);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al agregar habitacion", 500);
            return;
        }
    });
}
function modificarHabitacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataHabitacion = (0, express_validator_1.matchedData)(req);
            const habitacionExistente = yield prisma.habitaciones.findUnique({
                where: { idHabitacion: String(dataHabitacion.idHabitacion) }
            });
            if (!habitacionExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de habitacion no encontrado", 404);
            }
            const updatedHabitacion = yield prisma.habitaciones.update({
                where: { idHabitacion: String(dataHabitacion.idHabitacion) },
                data: {
                    idHospedaje: String(dataHabitacion.idHospedaje),
                    numero: String(dataHabitacion.numero),
                    tipo: dataHabitacion.tipo,
                    precio: Number(dataHabitacion.precio),
                    capacidad: Number(dataHabitacion.capacidad),
                    servicios: String(dataHabitacion.servicios)
                }
            });
            res.status(200).json(updatedHabitacion);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al modificar la habitacion", 500);
            return;
        }
    });
}
function eliminarHabitacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const habitacionExistente = yield prisma.habitaciones.findUnique({
                where: { idHabitacion: String(id) }
            });
            if (!habitacionExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de habitacion no encontrada", 404);
            }
            // Eliminar habitacion
            yield prisma.habitaciones.delete({
                where: { idHabitacion: String(id) }
            });
            res.status(200).json({ success: true, message: 'Habitacion eliminada exitosamente' });
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al intentar eliminar la habitacion", 500);
        }
    });
}
// Actividades
function getActividades(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const actividades = yield prisma.actividades.findMany();
            if (actividades.length > 0) {
                res.status(200).json(actividades);
            }
            else {
                return res.status(404).send("No se encontraron actividades.");
            }
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar obtener actividades", 500);
            return;
        }
    });
}
function agregarActividad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataActividad = (0, express_validator_1.matchedData)(req);
            const nuevaActividad = yield prisma.actividades.create({
                data: {
                    nombre: String(dataActividad.nombre),
                    descripcion: String(dataActividad.descripcion),
                    imagen: String(dataActividad.imagen),
                    ciudad: String(dataActividad.ciudad),
                    precio: dataActividad.precio
                }
            });
            return res.status(201).json(nuevaActividad);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al agregar actividad", 500);
            return;
        }
    });
}
function modificarActividad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataActividad = (0, express_validator_1.matchedData)(req);
            const actividadExistente = yield prisma.actividades.findUnique({
                where: { idActividad: String(dataActividad.idActividad) }
            });
            if (!actividadExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de actividad no encontrado", 404);
            }
            const updatedActividad = yield prisma.actividades.update({
                where: { idActividad: String(dataActividad.idActividad) },
                data: {
                    idActividad: dataActividad.idActividad,
                    nombre: String(dataActividad.nombre),
                    descripcion: String(dataActividad.descripcion),
                    imagen: String(dataActividad.imagen),
                    ciudad: String(dataActividad.ciudad),
                    precio: dataActividad.precio
                }
            });
            res.status(200).json(updatedActividad);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar eliminar la habitacion", 500);
            return;
        }
    });
}
function eliminarActividad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            yield prisma.actividades.delete({
                where: { idActividad: String(id) }
            });
            res.status(200).json({ success: true, message: 'Actividad eliminada exitosamente' });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar eliminar la actividad", 500);
            return;
        }
    });
}
function subirFotos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body, files } = req;
            if (!files || files.length === 0)
                return (0, handleError_1.handleHttpError)(res, "No se recibieron archivos", 400);
            const hospedajeExistente = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(body.idHospedaje) },
                include: { fotos: true },
            });
            if (!hospedajeExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            }
            const MAX_FOTOS = 10;
            const fotosActuales = hospedajeExistente.fotos.length;
            const nuevas = files.length;
            if (fotosActuales + nuevas > MAX_FOTOS)
                return (0, handleError_1.handleHttpError)(res, `El hospedaje ya tiene ${fotosActuales} fotos. Solo puedes agregar ${MAX_FOTOS - fotosActuales} más.`, 400);
            // Obtener el valor máximo actual de "sort" para este hospedaje
            const ultimaFoto = yield prisma.fotos.findFirst({
                where: { idHospedaje: body.idHospedaje },
                orderBy: { sort: "desc" },
                select: { sort: true },
            });
            const sortInicial = ultimaFoto ? ultimaFoto.sort + 1 : 1;
            // Mapear todos los archivos subidos
            const archivosData = files.map((file, index) => ({
                idHospedaje: body.idHospedaje,
                url: `${PUBLIC_URL}/uploads/${file.filename}`,
                sort: sortInicial + index,
            }));
            // Guardar en la db
            const data = yield prisma.fotos.createMany({ data: archivosData });
            return res.status(201).send({
                mensaje: `${data.count} fotos fueron agregadas`,
            });
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al subir fotos", 500);
        }
    });
}
function actualizarOrden(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fotos } = req.body;
            if (!fotos || fotos.length === 0)
                return (0, handleError_1.handleHttpError)(res, "No se recibieron fotos", 400);
            yield prisma.$transaction(fotos.map((f) => prisma.fotos.update({
                where: { idFoto: f.idFoto },
                data: { sort: f.sort },
            })));
            return res.status(200).send({ message: "Fotos actualizadas" });
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al actualizar foto", 500);
        }
    });
}
function eliminarFoto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = req.params;
            const id = params.id;
            const foto = yield prisma.fotos.findUnique({
                where: { idFoto: id }
            });
            if (!foto)
                return (0, handleError_1.handleHttpError)(res, "Archivo no encontrado en la base de datos", 404);
            const filePath = foto.url;
            const fileName = filePath.split('/').pop();
            // Verificar si el archivo existe
            if (fs_1.default.existsSync(`${MEDIA_PATH}/${fileName}`)) {
                // Eliminar archivo físico
                fs_1.default.unlinkSync(`${MEDIA_PATH}/${fileName}`);
            }
            else {
                //console.log('El archivo físico no existía, pero se procederá a eliminar el registro de la BD');
            }
            yield prisma.fotos.delete({
                where: { idFoto: id }
            });
            res.status(200).json({ success: true, message: 'Foto eliminada exitosamente' });
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al eliminar foto", 500);
        }
    });
}
/*--- Funciones Extras ---*/
const eliminarImagenesPorHospedaje = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener los url de las imágenes asociadas al IdHospedaje
        const imagenes = yield prisma.fotos.findMany({
            where: { idHospedaje: String(id) },
            select: {
                url: true
            }
        });
        for (const imagen of imagenes) {
            const nombreArchivoFisico = `${imagen.url}`;
            const ruta = path_1.default.join(__dirname, '../uploads', nombreArchivoFisico);
            try {
                // Verificar y eliminar archivo físico
                yield fs_1.default.promises.unlink(ruta);
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    //console.warn(`Archivo no encontrado en disco: ${ruta}`);
                }
                else {
                    //console.error(`Error al eliminar archivo físico: ${ruta}`, err);
                }
                // Seguir eliminando los demás aunque uno falle
            }
        }
        // Eliminar las fotos de la base de datos
        yield prisma.fotos.deleteMany({
            where: { idHospedaje: id }
        });
    }
    catch (error) {
        throw (0, handleError_1.handleHttpError)(res, "Error al eliminar archivos de Consulta: error", 500);
    }
});
//# sourceMappingURL=admin.js.map