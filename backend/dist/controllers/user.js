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
exports.getData = getData;
exports.updateData = updateData;
exports.subscribeEmail = subscribeEmail;
const prisma_1 = require("../generated/prisma");
const express_validator_1 = require("express-validator");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
// Devolver datos del usuario
function getData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const idUsuario = data.id;
            if (req.user.idUsuario !== idUsuario) {
                return (0, handleError_1.handleHttpError)(res, "No tienes permiso para ver datos de este usuario", 401);
            }
            const existingUser = yield prisma.usuario.findUnique({
                where: { idUsuario: String(idUsuario) },
                select: {
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true
                },
            });
            if (!existingUser) {
                (0, handleError_1.handleHttpError)(res, "USUARIO NO EXISTE", 404);
                return;
            }
            res.status(200).json(existingUser);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener datos del usuario", 500);
            return;
        }
    });
}
// Actualizar perfil de usuario
function updateData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataUser = (0, express_validator_1.matchedData)(req);
            if (req.user.idUsuario !== dataUser.idUsuario) {
                return (0, handleError_1.handleHttpError)(res, "No tienes permiso para actualizar este usuario", 403);
            }
            const updatedUser = yield prisma.usuario.update({
                where: { idUsuario: String(dataUser.idUsuario) },
                data: {
                    nombre: dataUser.nombre,
                    apellido: dataUser.apellido,
                    email: dataUser.email,
                    telefono: dataUser.telefono
                },
                select: {
                    idUsuario: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true
                }
            });
            if (!updatedUser) {
                (0, handleError_1.handleHttpError)(res, "ID de usuario incorrecto", 404);
                return;
            }
            res.status(200).json(updatedUser);
        }
        catch (err) {
            (0, handleError_1.handleHttpError)(res, "No se pudo actualizar el usuario", 500);
            return;
        }
    });
}
// Guardar suscripción de email
function subscribeEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataUser = (0, express_validator_1.matchedData)(req);
            const existingUser = yield prisma.suscripcionesNewsletter.findUnique({
                where: { email: dataUser.email }
            });
            if (existingUser) {
                (0, handleError_1.handleHttpError)(res, "El email ya está suscrito", 400);
                return;
            }
            const subscribed = yield prisma.suscripcionesNewsletter.create({
                data: {
                    email: dataUser.email,
                },
            });
            res.status(201).json({ " message": "Suscripto correctamente.", "email": subscribed });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "No se pudo suscribir al email", 500);
            return;
        }
    });
}
//# sourceMappingURL=user.js.map