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
(0, globals_1.describe)("[Habitacion] Pruebas de /api/habitacion/hospedaje", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/habitacion/hospedaje?idHospedaje=111`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // No hay habitaciones disponibles con los filtros seleccionados
    (0, globals_1.test)("Debería retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/habitacion/hospedaje?idHospedaje=${hospedajeId}&capacidad=5`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Hospedaje no existe
    (0, globals_1.test)("Debería retornar 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/habitacion/hospedaje?idHospedaje=${fakeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Mostrar habitaciones
    (0, globals_1.test)("Debería retornar 200 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/habitacion/hospedaje?idHospedaje=${hospedajeId}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("idHabitacion");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("numero");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("precio");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("servicios");
    }));
});
//# sourceMappingURL=09_habitacion.test.js.map