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
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
(0, globals_1.describe)("[Servicio] Pruebas de /api/servicio/", () => {
    // Tipo no valido
    (0, globals_1.test)("Debería retornar 403 - tipo de servicio incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/servicio?tipo=any');
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Tipo hospedaje
    (0, globals_1.test)("Debería retornar 200 - servicios de hospedaje", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/servicio?tipo=hospedaje');
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0].tipo).toEqual("hospedaje");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("nombre");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("descripcion");
    }));
    // Tipo habitacion
    (0, globals_1.test)("Debería retornar 200 - servicios de habitacion", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/servicio?tipo=habitacion');
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0].tipo).toEqual("habitacion");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("nombre");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("descripcion");
    }));
});
//# sourceMappingURL=04_servicio.test.js.map