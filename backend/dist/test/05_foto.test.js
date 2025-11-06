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
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const helperData_1 = require("./helper/helperData");
let JWT_TOKEN = "";
let idHospedaje;
const filePath = `${__dirname}/dump/hotel.jpg`;
let idFoto;
// Se ejecuta antes de las pruebas
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    prisma.fotos.deleteMany();
    // Login de usuario administrador
    const response = yield (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .send(helperData_1.userLoginAdmin);
    JWT_TOKEN = response.body.data.token;
    // Crear un hospedaje
    const createResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/api/admin/hospedajes/agregar')
        .send(helperData_1.hospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
    idHospedaje = createResponse.body.idHospedaje;
}));
(0, globals_1.describe)("[Foto] Pruebas de /api/foto/subir", () => {
    // No se inicio session o no es administrador
    (0, globals_1.test)("Debería retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/foto/subir')
            .field("idHospedaje", idHospedaje);
        // .attach("archivos", filePath); Problema con node
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // No hay archivos
    (0, globals_1.test)("Debería retornar 400 - no se subieron archivos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/foto/subir')
            .field("idHospedaje", idHospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
    // Fotos subidas correctamente
    (0, globals_1.test)("Debería retornar 201", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/foto/subir')
            .field("idHospedaje", idHospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .attach("fotos", filePath);
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(Array.isArray(response.body.data)).toBe(true);
        (0, globals_1.expect)(response.body.data[0]).toHaveProperty("path");
        (0, globals_1.expect)(response.body.data[0].idHospedaje).toEqual(idHospedaje);
        idFoto = response.body.data[0].idFoto;
    }));
});
(0, globals_1.describe)("[Foto] Pruebas de /api/foto/hospedaje/{id}", () => {
    // ID formato de ID incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/foto/hospedaje/123');
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // ID de hospedaje no existe
    (0, globals_1.test)("Debería retornar 404 - no existe el hospedaje", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/foto/hospedaje/${fakeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Hospedaje sin fotos
    (0, globals_1.test)("Debería retornar 404 - el hospedaje no tien fotos", () => __awaiter(void 0, void 0, void 0, function* () {
        // Crear un hospedaje
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send(helperData_1.hospedaje);
        const idHospedajeSinFoto = createResponse.body.idHospedaje;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/foto/hospedaje/${idHospedajeSinFoto}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Hospedaje con fotos
    (0, globals_1.test)("Debería retornar 200 - fotos del hospedaje", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/foto/hospedaje/${idHospedaje}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("idFoto");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("path");
        (0, globals_1.expect)(response.body[0].idHospedaje).toEqual(idHospedaje);
    }));
});
(0, globals_1.describe)("[Foto] Pruebas de /api/foto/eliminar/{id}", () => {
    // ID formato de ID incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/foto/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // ID de foto no existe
    (0, globals_1.test)("Debería retornar 404 - no existe el hospedaje", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/foto/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // No inicio session o no es administrador
    (0, globals_1.test)("Debería retornar 401 - no inicio session o no es adminsitrador", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/foto/eliminar/123');
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Foto eliminada
    (0, globals_1.test)("Debería retornar 200 - foto eliminada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/foto/eliminar/${idFoto}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.success).toBe(true);
        (0, globals_1.expect)(response.body.message).toContain("exitosamente");
    }));
});
//# sourceMappingURL=05_foto.test.js.map