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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHospedajes = getHospedajes;
exports.getHospedaje = getHospedaje;
exports.getHospedajeDetalle = getHospedajeDetalle;
exports.getHospedajesDestacados = getHospedajesDestacados;
const prisma_1 = require("../generated/prisma");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function getHospedajes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ciudad, fechaInicio, fechaFin, capacidad } = req.query;
            /*
                Busca hospedajes que tengan habitaciones con las siguientes condiciones:
                    - Hospedaje de la ciudad seleccionada
                    - NO reservadas entre las fechas seleccionadas
                    - capacidad mayor o igual a la seleccionada
            */
            const hospedajes = yield prisma.hospedaje.findMany({
                where: Object.assign(Object.assign({}, (ciudad && {
                    ciudad: String(ciudad),
                    estado: prisma_1.hospedaje_estado.activo
                })), { habitaciones: {
                        some: Object.assign(Object.assign({}, (capacidad && { capacidad: { gte: Number(capacidad) } })), (fechaInicio && fechaFin
                            ? {
                                reservas_hospedajes: {
                                    none: {
                                        fechaInicio: { lte: new Date(String(fechaFin)) },
                                        fechaFin: { gte: new Date(String(fechaInicio)) },
                                    },
                                },
                            }
                            : {})),
                    } }),
                include: {
                    habitaciones: {
                        where: Object.assign(Object.assign({}, (capacidad && { capacidad: { gte: Number(capacidad) } })), (fechaInicio && fechaFin
                            ? {
                                reservas_hospedajes: {
                                    none: {
                                        fechaInicio: { lte: new Date(String(fechaFin)) },
                                        fechaFin: { gte: new Date(String(fechaInicio)) },
                                    },
                                },
                            }
                            : {})),
                        select: {
                            idHabitacion: true,
                            capacidad: true,
                            precio: true,
                        },
                    },
                    fotos: {
                        orderBy: { sort: 'asc' },
                        take: 1,
                    },
                }
            });
            if (hospedajes.length === 0) {
                return res.status(404).json({ message: "No hay hospedajes disponibles." });
            }
            const result = yield Promise.all(hospedajes.map((h) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const capacidades = h.habitaciones.map((hab) => hab.capacidad);
                const precios = h.habitaciones.map((hab) => hab.precio);
                let serviciosData = [];
                if (typeof h.servicios === 'string') {
                    const ids = h.servicios.split(',').map((id) => Number(id));
                    serviciosData = yield prisma.servicios.findMany({
                        where: { idServicio: { in: ids } },
                        select: { nombre: true, descripcion: true },
                    });
                }
                else {
                    serviciosData = h.servicios || [];
                }
                return Object.assign(Object.assign({}, h), { capacidad: Math.max(...capacidades), precioMinimo: Math.min(...precios), 
                    // 👇 Aquí convertimos fotos a string (por ejemplo, solo la primera URL)
                    fotos: (_c = (_b = (_a = h.fotos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null, servicios: serviciosData });
            })));
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedajes", 500);
            return;
        }
    });
}
function getHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hospedaje = yield prisma.hospedaje.findUnique({
                where: {
                    idHospedaje: String(req.params.id),
                    estado: prisma_1.hospedaje_estado.activo
                }
            });
            if (!hospedaje) {
                (0, handleError_1.handleHttpError)(res, "No se encuentra el hospedaje", 404);
                return;
            }
            res.status(200).json(hospedaje);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedajes", 500);
            return;
        }
    });
}
function getHospedajeDetalle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hospedaje = yield prisma.hospedaje.findUnique({
                where: {
                    idHospedaje: String(req.params.id),
                    estado: prisma_1.hospedaje_estado.activo
                }
            });
            // Obtener hospedaje
            if (!hospedaje) {
                (0, handleError_1.handleHttpError)(res, "No se encuentra el hospedaje", 404);
                return;
            }
            // Obtener fotos
            const fotos = yield prisma.fotos.findMany({
                where: { idHospedaje: String(req.params.id) },
                select: { url: true }
            });
            // Obtener servicios
            const serviciosIds = hospedaje.servicios
                .split(',')
                .map(id => Number(id.trim())); // trim() por si hay espacios
            const servicios = yield prisma.servicios.findMany({
                where: {
                    idServicio: { in: serviciosIds }
                },
                select: {
                    nombre: true,
                    descripcion: true
                }
            });
            // reseñas
            const resenas = yield prisma.resena.findMany({
                where: {
                    idHospedaje: String(req.params.id)
                }
            });
            const calificacionPromedio = resenas.length > 0
                ? resenas.reduce((acc, r) => { var _a; return acc + ((_a = r.calificacion) !== null && _a !== void 0 ? _a : 0); }, 0) / resenas.length
                : 0;
            const data = Object.assign(Object.assign({}, hospedaje), { fotos: fotos.map(f => f.url), servicios,
                calificacionPromedio,
                resenas });
            res.status(200).json(data);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedajes", 500);
            return;
        }
    });
}
function getHospedajesDestacados(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hospedajes = yield prisma.hospedaje.findMany({
                where: {
                    destacado: true,
                    estado: prisma_1.hospedaje_estado.activo
                },
                include: {
                    fotos: {
                        orderBy: { sort: 'asc' },
                        take: 1,
                    },
                }
            });
            if (hospedajes.length === 0)
                return (0, handleError_1.handleHttpError)(res, "No hay hospedajes destacados", 404);
            const hospedajesConPrecioMinimo = yield Promise.all(hospedajes.map((hospedaje) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const habitacionMasBarata = yield prisma.habitaciones.findFirst({
                    where: { idHospedaje: hospedaje.idHospedaje },
                    orderBy: { precio: 'asc' },
                    select: { precio: true },
                });
                return Object.assign(Object.assign({}, hospedaje), { fotos: (_c = (_b = (_a = hospedaje.fotos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null, precioMinimo: (_d = habitacionMasBarata === null || habitacionMasBarata === void 0 ? void 0 : habitacionMasBarata.precio) !== null && _d !== void 0 ? _d : null });
            })));
            return res.status(200).json(hospedajesConPrecioMinimo);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener hospedajes", 500);
            return;
        }
    });
}
//# sourceMappingURL=hospedaje.js.map