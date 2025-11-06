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
exports.authMiddleware = void 0;
const handlerJwt_1 = require("../utils/handlerJwt");
const handleError_1 = require("../utils/handleError");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return (0, handleError_1.handleHttpError)(res, "NOT TOKEN", 401);
        }
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = yield (0, handlerJwt_1.verifyToken)(String(token));
        if (!dataToken) {
            return (0, handleError_1.handleHttpError)(res, "NOT PAYLOAD DATA", 401);
        }
        const user = yield prisma.usuario.findUnique({
            where: {
                idUsuario: dataToken.idUsuario
            }
        });
        if (!user)
            return (0, handleError_1.handleHttpError)(res, "USUARIO NO ENCONTRADO", 404);
        req.user = user;
        return next();
    }
    catch (error) {
        return (0, handleError_1.handleHttpError)(res, "NOT SESSION", 401);
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=session.js.map