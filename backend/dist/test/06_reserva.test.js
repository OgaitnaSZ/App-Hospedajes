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
let hospedajeId;
let habitacionId;
let actividadId;
let reservaHospedajeId;
let reservaActividadId;
let pagoHospedajeId;
let pagoActividadId;
let preferenciaPagoHospedaje;
let preferenciaPagoActividad;
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
    // Crear actividad para las pruebas
    const actividadResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/api/admin/actividades/agregar')
        .send(helperData_1.actividad)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
    actividadId = actividadResponse.body.idActividad;
}));
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/reservar-hospedaje", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservar-hospedaje')
            .send({ idHospedaje: hospedajeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Sin autenticación
    (0, globals_1.test)("Debería retornar 401 - sin token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
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
            idPreferencia: "PREF123456"
        });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Reserva correcta
    (0, globals_1.test)("Debería retornar 201 - hospedaje reservado", () => __awaiter(void 0, void 0, void 0, function* () {
        preferenciaPagoHospedaje = `PREF_HOSPEDAJE_${Date.now()}`;
        const response = yield (0, supertest_1.default)(app_1.default)
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
            idPreferencia: preferenciaPagoHospedaje
        })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        reservaHospedajeId = response.body.nuevaReserva.idReserva;
        pagoHospedajeId = response.body.nuevoPago.idPago;
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("nuevaReserva");
        (0, globals_1.expect)(response.body).toHaveProperty("nuevoPago");
        (0, globals_1.expect)(response.body.nuevaReserva).toHaveProperty("idReserva");
        (0, globals_1.expect)(response.body.nuevaReserva.estado).toEqual("pendiente");
        (0, globals_1.expect)(response.body.nuevoPago.estado).toEqual("pendiente");
        (0, globals_1.expect)(response.body.nuevaReserva.precioTotal).toEqual(600);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/reservar-actividad", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservar-actividad')
            .send({ idActividad: actividadId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Sin autenticación
    (0, globals_1.test)("Debería retornar 401 - sin token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservar-actividad')
            .send({
            idUsuario: user.idUsuario,
            idActividad: actividadId,
            fecha: "2025-11-10",
            personas: 3,
            precioTotal: 300,
            nombre: user.nombre,
            apellido: "Test",
            dni: "12345678",
            direccion: "Calle Test",
            email: user.email,
            telefono: "1234567890",
            idPreferencia: "PREF_ACT123456"
        });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Reserva de actividad correcta
    (0, globals_1.test)("Debería retornar 201 - actividad reservada", () => __awaiter(void 0, void 0, void 0, function* () {
        preferenciaPagoActividad = `PREF_ACTIVIDAD_${Date.now()}`;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservar-actividad')
            .send({
            idUsuario: user.idUsuario,
            idActividad: actividadId,
            fecha: "2025-11-10",
            personas: 3,
            precioTotal: 300,
            nombre: user.nombre,
            apellido: "Test",
            dni: "12345678",
            direccion: "Calle Test",
            email: user.email,
            telefono: "1234567890",
            idPreferencia: preferenciaPagoActividad
        })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        reservaActividadId = response.body.nuevaReserva.idReserva;
        pagoActividadId = response.body.nuevoPago.idPago;
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("nuevaReserva");
        (0, globals_1.expect)(response.body).toHaveProperty("nuevoPago");
        (0, globals_1.expect)(response.body.nuevaReserva).toHaveProperty("idReserva");
        (0, globals_1.expect)(response.body.nuevaReserva.estado).toEqual("pendiente");
        (0, globals_1.expect)(response.body.nuevoPago.estado).toEqual("pendiente");
        (0, globals_1.expect)(response.body.nuevaReserva.precioTotal).toEqual(300);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/reserva", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reserva')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Reserva no encontrada
    (0, globals_1.test)("Debería retornar 404 - reserva no encontrada", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reserva')
            .send({ id: fakeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Reserva no encontrada
    (0, globals_1.test)("Debería retornar 401 - No inicio session", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reserva')
            .send({ id: fakeId, tipo: "hospedaje" });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Obtener reserva de hospedaje
    (0, globals_1.test)("Debería retornar 200 - reserva de hospedaje obtenida", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reserva')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body).toHaveProperty("idReserva");
        (0, globals_1.expect)(response.body.idReserva).toEqual(reservaHospedajeId);
        (0, globals_1.expect)(response.body.estado).toEqual("pendiente");
    }));
    // Obtener reserva de actividad
    (0, globals_1.test)("Debería retornar 200 - reserva de actividad obtenida", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reserva')
            .send({ id: reservaActividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body).toHaveProperty("idReserva");
        (0, globals_1.expect)(response.body.idReserva).toEqual(reservaActividadId);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/reservas-usuario", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservas-usuario')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Obtener reservas de hospedaje del usuario
    (0, globals_1.test)("Debería retornar 200 - reservas de hospedaje del usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("hospedaje");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("habitaciones");
    }));
    // Obtener reservas de actividad del usuario
    (0, globals_1.test)("Debería retornar 200 - reservas de actividad del usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("actividades");
    }));
    // No inicio session o no es el usuario
    (0, globals_1.test)("Debería retornar 401 - no autirizado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "actividad" });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/fechas-ocupadas", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/fechas-ocupadas')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Not session
    (0, globals_1.test)("Debería retornar 401 - no inicio session", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: hospedajeId, tipo: "hospedaje" });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Fechas ocupadas de hospedaje
    (0, globals_1.test)("Debería retornar 200 - fechas ocupadas de hospedaje", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: hospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("fechaInicio");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("fechaFin");
    }));
    // Fechas ocupadas de actividad
    (0, globals_1.test)("Debería retornar 200 - fechas ocupadas de actividad", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: actividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("fecha");
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/verificar-pago-hospedaje", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Pago no encontrado
    (0, globals_1.test)("Debería retornar 404 - pago no encontrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: "PREF_NO_EXISTE" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // No inicio session
    (0, globals_1.test)("Debería retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: preferenciaPagoHospedaje });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Verificar pago
    (0, globals_1.test)("Debería retornar 200 - pago aprobado", () => __awaiter(void 0, void 0, void 0, function* () {
        // Aprobar pago
        yield prisma.pagos_hospedajes.updateMany({
            where: { idPreferencia: preferenciaPagoHospedaje },
            data: { estado: 'aprobado' },
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: preferenciaPagoHospedaje })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/verificar-pago-actividad", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-actividad')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Pago no encontrado
    (0, globals_1.test)("Debería retornar 404 - pago no encontrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: "PREF_NO_EXISTE" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // No inicio session
    (0, globals_1.test)("Debería retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: preferenciaPagoActividad });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Verificar pago
    (0, globals_1.test)("Debería retornar 200 - pago aprobado", () => __awaiter(void 0, void 0, void 0, function* () {
        // Aprobar pago
        yield prisma.pagos_actividades.updateMany({
            where: { idPreferencia: preferenciaPagoActividad },
            data: { estado: 'aprobado' },
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: preferenciaPagoActividad })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
    }));
});
(0, globals_1.describe)("[RESERVA] Pruebas de /api/reserva/cancelar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/cancelar')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Reserva no encontrada
    (0, globals_1.test)("Debería retornar 404 - reserva no encontrada", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/cancelar')
            .send({ id: fakeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // No inicio session
    (0, globals_1.test)("Debería retornar 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/cancelar')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" });
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Cancelar reserva de hospedaje
    (0, globals_1.test)("Debería retornar 200 - reserva de hospedaje cancelada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/cancelar')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.estado).toEqual("pendiente_de_cancelacion");
    }));
    // Cancelar reserva de actividad
    (0, globals_1.test)("Debería retornar 200 - reserva de actividad cancelada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/reserva/cancelar')
            .send({ id: reservaActividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.estado).toEqual("pendiente_de_cancelacion");
    }));
});
//# sourceMappingURL=06_reserva.test.js.map