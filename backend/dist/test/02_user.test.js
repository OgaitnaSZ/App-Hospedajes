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
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const helperData_1 = require("./helper/helperData");
let JWT_TOKEN = "";
let user;
// Se ejecuta antes de las pruebas
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.suscripcionesNewsletter.deleteMany();
    yield prisma.usuario.deleteMany({
        where: {
            rol: {
                not: 'administrador'
            }
        }
    });
    const response = yield (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send(helperData_1.userRegister);
    user = response.body.data.user;
    JWT_TOKEN = response.body.data.token;
}));
(0, globals_1.describe)("[USER] esta es la prueba de /api/user/get-data/:id", () => {
    // Formato de ID no valido
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/user/get-data/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No inicio session o es otro usuario
    (0, globals_1.test)("Esto deberia retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/user/get-data/${fakeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Usuario correcto
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/user/get-data/${user.idUsuario}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const { body } = response;
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(body).toHaveProperty("nombre");
        (0, globals_1.expect)(body).toHaveProperty("email");
        (0, globals_1.expect)(body.nombre).toEqual(user.nombre);
        (0, globals_1.expect)(body.email).toEqual(user.email);
    }));
});
(0, globals_1.describe)("[USER] esta es la prueba de /api/user/update-data", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/user/update-data')
            .send({ nombre: "name test" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No se puede modificar a otro usuario
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/user/update-data`)
            .send(Object.assign(Object.assign({}, user), { idUsuario: fakeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Usuario correcto
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/user/update-data`)
            .send(Object.assign(Object.assign({}, user), { nombre: "Santiago" }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const { body } = response;
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(body).toHaveProperty("nombre");
        (0, globals_1.expect)(body).toHaveProperty("email");
        (0, globals_1.expect)(body.nombre).toEqual("Santiago");
    }));
});
(0, globals_1.describe)("[USER] esta es la prueba de /api/user/subscribe-email", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/user/subscribe-email')
            .send({ email: "name test" });
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Email correcto
    (0, globals_1.test)("Esto deberia retornar 201", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/user/subscribe-email')
            .send({ email: "test123@gmail.com" });
        (0, globals_1.expect)(response.statusCode).toEqual(201);
    }));
    // Email ya suscripto
    (0, globals_1.test)("Esto deberia retornar 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/user/subscribe-email')
            .send({ email: "test123@gmail.com" });
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
});
//# sourceMappingURL=02_user.test.js.map