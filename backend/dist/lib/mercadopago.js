"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpPreference = void 0;
// src/lib/mercadoPago.ts
const mercadopago_1 = require("mercadopago");
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});
exports.mpPreference = new mercadopago_1.Preference(client);
//# sourceMappingURL=mercadopago.js.map