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
exports.getFotos = getFotos;
const prisma_1 = require("../generated/prisma");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function getFotos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.params;
            const id = data.id;
            const fotos = yield prisma.fotos.findMany({
                where: {
                    idHospedaje: id
                }
            });
            if (fotos.length == 0)
                return (0, handleError_1.handleHttpError)(res, "No hay fotos para esta consulta", 404);
            res.status(200).json(fotos);
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al obtener fotos", 500);
        }
    });
}
//# sourceMappingURL=foto.js.map