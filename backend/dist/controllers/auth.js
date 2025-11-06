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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.updatePassword = updatePassword;
exports.recoverPassword = recoverPassword;
exports.resetPassword = resetPassword;
const prisma_1 = require("../generated/prisma");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_validator_1 = require("express-validator");
const handlePassword_1 = require("../utils/handlePassword");
const handlerJwt_1 = require("../utils/handlerJwt");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataLogin = (0, express_validator_1.matchedData)(req);
            const existingUser = yield prisma.usuario.findUnique({
                where: { email: dataLogin.email }
            });
            if (!existingUser) {
                (0, handleError_1.handleHttpError)(res, "USUARIO NO EXISTE", 404);
                return;
            }
            const hashPassword = existingUser.password;
            const check = yield (0, handlePassword_1.compare)(dataLogin.password, hashPassword);
            if (!check) {
                (0, handleError_1.handleHttpError)(res, "PASSWORD INVALIDO", 400);
                return;
            }
            const token = yield (0, handlerJwt_1.tokenSign)(existingUser);
            const { password } = existingUser, userWithoutPassword = __rest(existingUser, ["password"]); // Eliminar password para la respuesta
            const data = {
                token,
                user: userWithoutPassword
            };
            res.status(200).send({ data });
        }
        catch (error) {
            res.status(500);
            (0, handleError_1.handleHttpError)(res, "ERROR_LOGIN_USER");
            return;
        }
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataRegister = (0, express_validator_1.matchedData)(req);
            const existingUser = yield prisma.usuario.findUnique({
                where: { email: dataRegister.email }
            });
            if (existingUser) {
                (0, handleError_1.handleHttpError)(res, "El email ya está registrado", 400);
                return;
            }
            const hashedPassword = yield (0, handlePassword_1.encrypt)(dataRegister.password);
            const dataUser = yield prisma.usuario.create({
                data: {
                    nombre: dataRegister.nombre,
                    apellido: dataRegister.apellido,
                    email: dataRegister.email,
                    telefono: dataRegister.telefono,
                    password: hashedPassword,
                    rol: 'huesped'
                }
            });
            const token = yield (0, handlerJwt_1.tokenSign)(dataUser);
            const { password } = dataUser, userWithoutPassword = __rest(dataUser, ["password"]); // Eliminar password para la respuesta
            const data = {
                token,
                user: userWithoutPassword
            };
            res.status(201);
            res.send({ data });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al registrar el usuario", 500);
            return;
        }
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataPassword = (0, express_validator_1.matchedData)(req);
            console.log("Actualizando password...", dataPassword);
            if (req.user.idUsuario !== dataPassword.idUsuario) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para actualizar este usuario", 401);
                return;
            }
            const existingUser = yield prisma.usuario.findUnique({
                where: { idUsuario: dataPassword.idUsuario }
            });
            if (!existingUser) {
                (0, handleError_1.handleHttpError)(res, "USUARIO NO EXISTE", 404);
                return;
            }
            const hashPassword = existingUser.password;
            const check = yield (0, handlePassword_1.compare)(dataPassword.password, hashPassword);
            if (!check) {
                (0, handleError_1.handleHttpError)(res, "PASSWORD INVALIDO", 400);
                return;
            }
            const hashedNewPassword = yield (0, handlePassword_1.encrypt)(dataPassword.newPassword);
            const updatedUser = yield prisma.usuario.update({
                where: { idUsuario: dataPassword.idUsuario },
                data: { password: hashedNewPassword }
            });
            const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]); // Eliminar password para la respuesta
            res.status(200).send({ userWithoutPassword });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al actualizar password", 500);
            return;
        }
    });
}
function recoverPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emailUser = (0, express_validator_1.matchedData)(req);
            const existingUser = yield prisma.usuario.findUnique({
                where: { email: emailUser.email }
            });
            if (!existingUser) {
                res.status(200).send({ message: "Correo de recuperación enviado" }); // Para mas seguridad
                return;
            }
            // Eliminar tokens viejos de la DB
            yield prisma.password_resets.deleteMany({
                where: { email: emailUser.email }
            });
            // Generar nuevo token que expira en una hora
            const token = crypto_1.default.randomBytes(16).toString("hex");
            const expiry = new Date(Date.now() + 60 * 60 * 1000);
            // Guardar token en la db
            const reset = yield prisma.password_resets.create({
                data: {
                    email: emailUser.email,
                    token: token,
                    expiry: expiry,
                },
            });
            // transporter con SMTP de tu proveedor
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.tu-proveedor.com",
                port: 587,
                secure: false, // true si usas 465
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            const resetLink = `${process.env.PUBLIC_URL}/reset-password?token=${token}`;
            // await transporter.sendMail({
            //   from: '"Soporte" <no-reply@tu-dominio.com>',
            //   to: emailUser.email,
            //   subject: "Recuperación de contraseña",
            //   text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
            //   html: `<p>Haz clic en el enlace para restablecer tu contraseña:</p>
            //          <a href="${resetLink}">${resetLink}</a>`,
            // });
            res.status(200).send({ message: "Correo de recuperación enviado" });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar recuperar el password", 500);
            return;
        }
    });
}
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            // Buscar token
            const resetEntry = yield prisma.password_resets.findUnique({
                where: { token: data.token },
            });
            if (!resetEntry || resetEntry.expiry < new Date()) {
                (0, handleError_1.handleHttpError)(res, "Token inválido o expirado", 400);
                return;
            }
            // Hashear contraseña nueva
            const hashedPassword = yield (0, handlePassword_1.encrypt)(data.password);
            // Actualizar usuario
            yield prisma.usuario.update({
                where: { email: resetEntry.email },
                data: { password: hashedPassword },
            });
            // Eliminar token usado
            yield prisma.password_resets.delete({
                where: { token: data.token },
            });
            res.status(200).send({ message: "Contraseña actualizada correctamente" });
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al intentar restablecer el password", 500);
            return;
        }
    });
}
//# sourceMappingURL=auth.js.map