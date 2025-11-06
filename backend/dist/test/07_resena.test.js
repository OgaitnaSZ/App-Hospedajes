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
let user;
let hospedajeId;
let habitacionId;
let resena;
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.resena.deleteMany();
    yield prisma.pagos_actividades.deleteMany();
    yield prisma.pagos_hospedajes.deleteMany();
    yield prisma.reservas_hospedajes.deleteMany();
    yield prisma.reservas_actividades.deleteMany();
    yield prisma.habitaciones.deleteMany();
    yield prisma.fotos.deleteMany();
    yield prisma.hospedaje.deleteMany();
    yield prisma.actividades.deleteMany();
    // Login de usuario
    const response = yield (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .send(helperData_1.userLoginAdmin);
    user = response.body.data.user;
    JWT_TOKEN = response.body.data.token;
    // Crear hospedaje para las pruebas
    const hospedajeResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/api/admin/hospedajes/agregar')
        .send(helperData_1.hospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
    hospedajeId = hospedajeResponse.body.idHospedaje;
    // Crear habitación para las pruebas
    const habitacionResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/api/admin/habitaciones/agregar')
        .send(Object.assign(Object.assign({}, helperData_1.habitacion), { idHospedaje: hospedajeId }))
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
    habitacionId = habitacionResponse.body.idHabitacion;
    // Crear reserva de hospedaje para las pruebas
    const preferenciaDePago = `PREF_HOSPEDAJE_${Date.now()}`;
    const reservaResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/api/reserva/reservar-hospedaje')
        .send({
        idUsuario: user.idUsuario,
        idHospedaje: hospedajeId,
        idHabitacion: habitacionId,
        fechaInicio: "2025-11-01",
        fechaFin: "2025-11-05",
        personas: 2,
        precioTotal: 600,
        nombre: user.nombre,
        apellido: "Test",
        dni: "12345678",
        direccion: "Calle Test",
        email: user.email,
        telefono: "1234567890",
        idPreferencia: preferenciaDePago
    })
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
}));
(0, globals_1.describe)("[Reseña] Pruebas de /api/resena/agregar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/resena/agregar')
            .send({ idUsuario: user.idUsuario })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No inicio sesion o no esta autorizado
    (0, globals_1.test)("Debería retornar 401 - no autorizado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/resena/agregar')
            .send({
            idUsuario: user.idUsuario,
            idHospedaje: hospedajeId,
            idHabitacion: habitacionId,
            calificacion: 5,
            comentario: "Exelente."
        });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Creacion de resena
    (0, globals_1.test)("Debería retornar 201", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/resena/agregar')
            .send({
            idUsuario: user.idUsuario,
            idHospedaje: hospedajeId,
            idHabitacion: habitacionId,
            calificacion: 5,
            comentario: "Exelente."
        })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("idUsuario");
        (0, globals_1.expect)(response.body).toHaveProperty("idResena");
        (0, globals_1.expect)(response.body.idHospedaje).toEqual(hospedajeId);
        (0, globals_1.expect)(response.body.calificacion).toEqual(5);
        resena = response.body;
    }));
});
(0, globals_1.describe)("[Reseña] Pruebas de /api/resena/actualizar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/resena/actualizar')
            .send({ idUsuario: user.idUsuario })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No inicio sesion o no esta autorizado
    (0, globals_1.test)("Debería retornar 401 - no autorizado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/resena/actualizar')
            .send(Object.assign(Object.assign({}, resena), { calificacion: 2 }));
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Reseña inexistente
    (0, globals_1.test)("Debería retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/resena/actualizar')
            .send(Object.assign(Object.assign({}, resena), { idResena: fakeId, calificacion: 2 }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Reseña correcta
    (0, globals_1.test)("Debería retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/resena/actualizar')
            .send(Object.assign(Object.assign({}, resena), { calificacion: 2 }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body).toHaveProperty("idResena");
        (0, globals_1.expect)(response.body.calificacion).toEqual(2);
    }));
});
(0, globals_1.describe)("[Reseña] Pruebas de /resena/usuario/{idUsuario}/hospedaje/{idHospedaje}/habitacion/{idHabitacion}", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/resena/usuario/123/hospedaje/123/habitacion/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No inicio session o usuario incorrecto
    (0, globals_1.test)("Debería retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${hospedajeId}/habitacion/${habitacionId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Resena no existente
    (0, globals_1.test)("Debería retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${fakeId}/habitacion/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Obtener reseña
    (0, globals_1.test)("Debería retornar 200 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${hospedajeId}/habitacion/${habitacionId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
    }));
});
(0, globals_1.describe)("[Reseña] Pruebas de /resena/hospedaje/:id", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/resena/hospedaje/10');
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No existe el hospedaje
    (0, globals_1.test)("Debería retornar 404 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/hospedaje/${fakeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Hospedaje sin resenas
    (0, globals_1.test)("Debería retornar 404 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const hospedajeResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send(helperData_1.hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const hospedajeId = hospedajeResponse.body.idHospedaje;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/hospedaje/${hospedajeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Obtener resenas
    (0, globals_1.test)("Debería retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/resena/hospedaje/${hospedajeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("idHospedaje");
        (0, globals_1.expect)(response.body[0].idHospedaje).toEqual(hospedajeId);
    }));
});
(0, globals_1.describe)("[Reseña] Pruebas de /resena/mejores/:cantidad", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/resena/mejores/10')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No hay reseñas de 4 o 5 puntos
    (0, globals_1.test)("Debería retornar 404 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/resena/mejores/3')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Obtener mejores resenas
    (0, globals_1.test)("Debería retornar 200", () => __awaiter(void 0, void 0, void 0, function* () {
        // Actualizar reseña para tener 5 puntos
        yield (0, supertest_1.default)(app_1.default)
            .put('/api/resena/actualizar')
            .send(Object.assign(Object.assign({}, resena), { calificacion: 5 }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/resena/mejores/3')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body[0].usuario).toEqual(user.nombre);
        (0, globals_1.expect)(response.body[0].calificacion).toEqual(5);
    }));
});
(0, globals_1.describe)("[Reseña] Pruebas de /resena/eliminar/:id", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - formato incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/resena/eliminar/123`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No inicio sesion
    (0, globals_1.test)("Debería retornar 401 - no session o no permisos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/resena/eliminar/${resena.idResena}`);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Eliminar reseña
    (0, globals_1.test)("Debería retornar 200 - formato incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/resena/eliminar/${resena.idResena}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.success).toBe(true);
        (0, globals_1.expect)(response.body.message).toContain("exitosamente");
    }));
    // Resena inexistente
    (0, globals_1.test)("Debería retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/resena/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
});
//# sourceMappingURL=07_resena.test.js.map