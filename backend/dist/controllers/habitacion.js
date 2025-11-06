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
exports.getHabitaciones = getHabitaciones;
const prisma_1 = require("../generated/prisma");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function getHabitaciones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idHospedaje, desde, hasta, capacidad } = req.query;
            const hospedajeExistente = yield prisma.hospedaje.findUnique({
                where: { idHospedaje: String(idHospedaje) }
            });
            if (!hospedajeExistente)
                return (0, handleError_1.handleHttpError)(res, "ID de hospedaje no encontrado", 404);
            const habitaciones = yield prisma.habitaciones.findMany({
                where: Object.assign(Object.assign({ idHospedaje: String(idHospedaje) }, (capacidad
                    ? {
                        capacidad: {
                            gte: Number(capacidad),
                        },
                    }
                    : {})), (desde && hasta
                    ? {
                        reservas_hospedajes: {
                            none: {
                                // Ninguna reserva que se superponga
                                fechaInicio: {
                                    lt: new Date(hasta),
                                },
                                fechaFin: {
                                    gt: new Date(desde),
                                },
                            },
                        },
                    }
                    : {}))
            });
            if (habitaciones.length > 0) {
                // Obtener servicios para habitaciones
                const habitacionesConServicios = yield Promise.all(habitaciones.map((h) => __awaiter(this, void 0, void 0, function* () {
                    let servicios = [{}];
                    if (typeof h.servicios === 'string') {
                        const serviciosIds = h.servicios
                            .split(',')
                            .map(id => Number(id.trim()));
                        servicios = yield prisma.servicios.findMany({
                            where: {
                                idServicio: { in: serviciosIds }
                            },
                            select: {
                                nombre: true,
                                descripcion: true
                            }
                        });
                    }
                    return Object.assign(Object.assign({}, h), { servicios });
                })));
                return res.status(200).json(habitacionesConServicios);
            }
            else {
                return res.status(404).send("No se encontraron habitaciones disponibles con los filtros seleccionados.");
            }
        }
        catch (error) {
            console.log(error);
            (0, handleError_1.handleHttpError)(res, "Error al obtener habitaciones", 500);
            return;
        }
    });
}
//# sourceMappingURL=habitacion.js.map