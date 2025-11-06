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
const mercadopago_1 = require("mercadopago");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});
const mpPayment = new mercadopago_1.Payment(client);
router.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (!(data === null || data === void 0 ? void 0 : data.id))
        return res.sendStatus(400);
    try {
        const pago = yield mpPayment.get({ id: data.id });
        const status = pago.status;
        const idReserva = pago.external_reference;
        if (status === "approved") {
            yield prisma.reservas_hospedajes.update({
                where: { idReserva: String(idReserva) },
                data: { estado: "pendiente" },
            });
        }
        res.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}));
//# sourceMappingURL=mercadopagoWebhook.js.map