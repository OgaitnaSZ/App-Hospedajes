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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const mercadopago_1 = require("../lib/mercadopago");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Admin
// Pagos
router.post("/crear-preferencia", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idReserva } = req.body;
        const reserva = yield prisma.reservas_hospedajes.findUnique({
            where: { idReserva: String(idReserva) },
            include: {
                habitaciones: true,
            },
        });
        if (!reserva)
            return res.status(404).json({ error: "Reserva no encontrada" });
        const dias = (new Date(reserva.fechaFin).getTime() -
            new Date(reserva.fechaInicio).getTime()) /
            (1000 * 60 * 60 * 24);
        const total = dias * Number(reserva.habitaciones.precio);
        const preference = yield mercadopago_1.mpPreference.create({
            body: {
                items: [
                    {
                        id: reserva.idReserva,
                        title: `Reserva ${reserva.idHospedaje}`,
                        quantity: 1,
                        unit_price: total,
                        currency_id: "ARS",
                    },
                ],
                back_urls: {
                    success: "http://localhost:4200/cuenta?pago=completado",
                    failure: "http://localhost:4200/cuenta?pago=fallido",
                    pending: "http://localhost:4200/cuenta?pago=pendiente",
                },
                auto_return: "approved",
                external_reference: String(reserva.idReserva),
                notification_url: "localhost:4001/api/mercadopagoWebhook/webhook",
            },
        });
        res.json({
            preferenceId: preference.id,
            init_point: preference.init_point,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
}));
//# sourceMappingURL=mercadopago.js.map