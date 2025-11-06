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
exports.getServicios = getServicios;
const prisma_1 = require("../generated/prisma");
const express_validator_1 = require("express-validator");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
function getServicios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            const tipo = data.tipo;
            const servicios = yield prisma.servicios.findMany({
                where: { tipo: tipo }
            });
            res.status(200).json(servicios);
        }
        catch (error) {
            (0, handleError_1.handleHttpError)(res, "Error al obtener servicios", 500);
            return;
        }
    });
}
//# sourceMappingURL=servicio.js.map