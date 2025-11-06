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
    JWT_TOKEN = response.body.data.token;
    user = response.body.data.user;
}));
(0, globals_1.describe)("[AUTH] esta es la prueba de /api/auth/register", () => {
    // Usuario correcto
    (0, globals_1.test)("Esto deberia retornar 201", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(Object.assign(Object.assign({}, helperData_1.userRegister), { email: "test1234@gmail.com" }));
        const { body } = response;
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(body).toHaveProperty("data");
        (0, globals_1.expect)(body.data).toHaveProperty("token");
        (0, globals_1.expect)(body.data).toHaveProperty("user");
    }));
    // Formato incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(Object.assign(Object.assign({}, helperData_1.userRegister), { email: "testing" }));
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Email ya registrado
    (0, globals_1.test)("Esto deberia retornar 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(helperData_1.userRegister);
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
});
(0, globals_1.describe)("[AUTH] esta es la prueba de /api/auth/login", () => {
    // Password erronea
    (0, globals_1.test)("Esto deberia retornar 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send(Object.assign(Object.assign({}, helperData_1.userLogin), { password: "111111111" }));
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
    // Usuario correcto
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send(helperData_1.userLogin);
        const { body } = response;
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(body).toHaveProperty("data");
        (0, globals_1.expect)(body.data).toHaveProperty("token");
        (0, globals_1.expect)(body.data).toHaveProperty("user");
    }));
    // Formato incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send(Object.assign(Object.assign({}, helperData_1.userLogin), { email: "testing" }));
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Usuario no existe
    (0, globals_1.test)("Esto deberia retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send(Object.assign(Object.assign({}, helperData_1.userLogin), { email: "testing111@gmail.com" }));
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
});
(0, globals_1.describe)("[AUTH] esta es la prueba de /api/auth/update-password", () => {
    // Sin session activa
    (0, globals_1.test)("Esto deberia retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/update-password')
            .send({ idUsuario: user.idUsuario, password: "test123", newPassword: "test1234" });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // No se puede modificar a otro usuario que no sea el logeado
    (0, globals_1.test)("Esto deberia retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/update-password')
            .send({ idUsuario: fakeId, password: "test123", newPassword: "test123" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Password erronea
    (0, globals_1.test)("Esto deberia retornar 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/update-password')
            .send({ idUsuario: user.idUsuario, password: "111111111", newPassword: "test123" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
    // Password correcta
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/update-password')
            .send({ idUsuario: user.idUsuario, password: "test123", newPassword: "test123" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const { body } = response;
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(body).toHaveProperty("updatedUser");
    }));
});
(0, globals_1.describe)("[AUTH] esta es la prueba de /api/auth/recover-password", () => {
    // Email no registrado
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/recover-password')
            .send({ email: "test1115@gmail.com" });
        (0, globals_1.expect)(response.statusCode).toEqual(200);
    }));
    // Formato incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/recover-password')
            .send({ email: "test123" });
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Email correcto
    (0, globals_1.test)("Esto deberia retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/recover-password')
            .send({ email: user.email });
        (0, globals_1.expect)(response.statusCode).toEqual(200);
    }));
});
(0, globals_1.describe)("[AUTH] esta es la prueba de /api/auth/reset-password", () => {
    // Token no valido o expirado
    (0, globals_1.test)("Esto deberia retornar 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password')
            .send({ password: "test123", token: "1" });
        (0, globals_1.expect)(response.statusCode).toEqual(400);
    }));
    // Formato incorrecto
    (0, globals_1.test)("Esto deberia retornar 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/reset-password')
            .send({ password: "", token: "" });
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
});
//# sourceMappingURL=01_auth.test.js.map