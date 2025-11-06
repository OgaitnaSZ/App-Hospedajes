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
exports.crearResena = crearResena;
exports.actualizarResena = actualizarResena;
exports.getResenasUsuario = getResenasUsuario;
exports.getResenasHospedaje = getResenasHospedaje;
exports.getMejoresResenas = getMejoresResenas;
exports.eliminarResena = eliminarResena;
const prisma_1 = require("../generated/prisma");
const express_validator_1 = require("express-validator");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function crearResena(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataResena = (0, express_validator_1.matchedData)(req);
            if (req.user.idUsuario !== dataResena.idUsuario) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para crear esta resena", 401);
                return;
            }
            const nuevaResena = yield prisma.resena.create({
                data: {
                    idHospedaje: dataResena.idHospedaje,
                    idUsuario: dataResena.idUsuario,
                    idHabitacion: dataResena.idHabitacion,
                    calificacion: dataResena.calificacion,
                    comentario: dataResena.comentario
                },
                select: {
                    idResena: true,
                    idHospedaje: true,
                    idUsuario: true,
                    idHabitacion: true,
                    calificacion: true,
                    comentario: true
                }
            });
            return res.status(201).json(nuevaResena);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al crear resena", 500);
            return;
        }
    });
}
function actualizarResena(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataResena = (0, express_validator_1.matchedData)(req);
            if (req.user.idUsuario !== dataResena.idUsuario) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para crear esta resena", 401);
                return;
            }
            const resenaExostemte = yield prisma.resena.findUnique({
                where: { idResena: String(dataResena.idResena) }
            });
            if (!resenaExostemte) {
                return (0, handleError_1.handleHttpError)(res, "ID de reseña no encontrada", 404);
            }
            const resenaActualizada = yield prisma.resena.update({
                where: {
                    idResena: String(dataResena.idResena)
                },
                data: {
                    calificacion: dataResena.calificacion,
                    comentario: dataResena.comentario
                }
            });
            return res.status(200).json(resenaActualizada);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener servicios", 500);
            return;
        }
    });
}
function getResenasUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idUsuario, idHospedaje, idHabitacion } = req.params;
            if (req.user.idUsuario !== idUsuario) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para ver esta resena", 401);
                return;
            }
            const resenaUsuario = yield prisma.resena.findFirst({
                where: {
                    idUsuario: String(idUsuario),
                    idHospedaje: String(idHospedaje),
                    idHabitacion: String(idHabitacion),
                }
            });
            if (!resenaUsuario)
                return (0, handleError_1.handleHttpError)(res, "No se encontraron reseñas", 404);
            res.status(200).json(resenaUsuario);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener reseña", 500);
            return;
        }
    });
}
function getResenasHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const hospedajeExistente = yield prisma.hospedaje.findUnique({
                where: {
                    idHospedaje: String(id),
                    estado: prisma_1.hospedaje_estado.activo
                }
            });
            if (!hospedajeExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            }
            const resenasHospedaje = yield prisma.resena.findMany({
                where: {
                    idHospedaje: String(id),
                }
            });
            if (resenasHospedaje.length === 0)
                return (0, handleError_1.handleHttpError)(res, "No se encontraron reseñas", 404);
            res.status(200).json(resenasHospedaje);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener reseña", 500);
            return;
        }
    });
}
function getMejoresResenas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cantidad = parseInt(req.query.cantidad) || 5;
            const resenas = yield prisma.resena.findMany({
                where: {
                    calificacion: {
                        in: [4, 5],
                    },
                },
                include: {
                    usuario: {
                        select: {
                            nombre: true,
                        },
                    },
                },
                take: cantidad,
                orderBy: {
                    updated_at: 'asc',
                },
            });
            if (resenas.length === 0)
                return (0, handleError_1.handleHttpError)(res, "No se encontraron reseñas de 5 o 4 estrellas", 404);
            const shuffled = resenas.sort(() => Math.random() - 0.5).slice(0, cantidad);
            const topResenas = shuffled.map((r) => ({
                idHospedaje: r.idHospedaje,
                calificacion: r.calificacion,
                comentario: r.comentario,
                usuario: r.usuario.nombre,
            }));
            res.status(200).json(topResenas);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener servicios", 500);
            return;
        }
    });
}
function eliminarResena(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const resenaExistente = yield prisma.resena.findUnique({
                where: { idResena: String(id) }
            });
            if (!resenaExistente) {
                return (0, handleError_1.handleHttpError)(res, "ID de resena no encontrado", 404);
            }
            if (req.user.idUsuario !== resenaExistente.idUsuario) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para eliminar esta resena", 401);
                return;
            }
            yield prisma.resena.delete({
                where: { idResena: String(id) }
            });
            res.status(200).json({ success: true, message: 'Reseña eliminada exitosamente' });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener servicios", 500);
            return;
        }
    });
}
//# sourceMappingURL=resena.js.map