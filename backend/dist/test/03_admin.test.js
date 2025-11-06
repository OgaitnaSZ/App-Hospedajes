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
let hospedajeId;
let habitacionId;
let actividadId;
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
    // Login de usuario administrador
    const response = yield (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .send(helperData_1.userLoginAdmin);
    JWT_TOKEN = response.body.data.token;
}));
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/hospedajes/agregar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send({ titulo: "Hospedaje Test" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Sin autenticación
    (0, globals_1.test)("Debería retornar 401 - sin token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send(helperData_1.hospedaje);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Datos correctos
    (0, globals_1.test)("Debería retornar 201 - hospedaje creado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send(helperData_1.hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("idHospedaje");
        (0, globals_1.expect)(response.body).toHaveProperty("titulo");
        (0, globals_1.expect)(response.body.titulo).toEqual("Hotel en Santiago");
        (0, globals_1.expect)(response.body.estrellas).toEqual(4);
        (0, globals_1.expect)(response.body.ciudad).toEqual("Santiago");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/hospedajes/hospedajes", () => {
    // No hay hospedajes
    (0, globals_1.test)("Debería retornar 404 - no hay hospedajes", () => __awaiter(void 0, void 0, void 0, function* () {
        // Eliminar hospedajes para prueba
        yield prisma.hospedaje.deleteMany();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/admin/hospedajes/hospedajes`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Obtener hospedajes
    (0, globals_1.test)("Debería retornar 200 - listado de hospedajes", () => __awaiter(void 0, void 0, void 0, function* () {
        // Volver a crear hospedaje para prueba
        const responseHospedaje = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send(helperData_1.hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        hospedajeId = responseHospedaje.body.idHospedaje;
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/admin/hospedajes/hospedajes`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("idHospedaje");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("titulo");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/hospedajes/modificar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/hospedajes/modificar')
            .send({ titulo: "Nuevo Título" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // ID incorrecto
    (0, globals_1.test)("Debería retornar 404 - hospedaje no encontrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/hospedajes/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.hospedaje), { idHospedaje: fakeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Modificación correcta
    (0, globals_1.test)("Debería retornar 200 - hospedaje modificado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/hospedajes/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.hospedaje), { titulo: "Hospedaje modificado", idHospedaje: hospedajeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.titulo).toEqual("Hospedaje modificado");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/habitaciones/agregar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/habitaciones/agregar')
            .send({ Numero: "101" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Sin autenticación
    (0, globals_1.test)("Debería retornar 401 - sin token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/habitaciones/agregar')
            .send(Object.assign(Object.assign({}, helperData_1.habitacion), { idHospedaje: hospedajeId }));
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Datos correctos
    (0, globals_1.test)("Debería retornar 201 - habitación creada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/habitaciones/agregar')
            .send(Object.assign(Object.assign({}, helperData_1.habitacion), { idHospedaje: hospedajeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        habitacionId = response.body.idHabitacion;
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("idHabitacion");
        (0, globals_1.expect)(response.body.numero).toEqual("101");
        (0, globals_1.expect)(response.body.tipo).toEqual("suite");
        (0, globals_1.expect)(response.body.precio).toEqual(400);
        (0, globals_1.expect)(response.body.capacidad).toEqual(4);
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/habitaciones/modificar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/habitaciones/modificar')
            .send({ numero: "102" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // ID incorrecto
    (0, globals_1.test)("Debería retornar 404 - habitación no encontrada", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/habitaciones/modificar')
            .send(Object.assign(Object.assign({ idHabitacion: fakeId }, helperData_1.habitacion), { idHospedaje: hospedajeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Modificación correcta
    (0, globals_1.test)("Debería retornar 200 - habitación modificada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/habitaciones/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.habitacion), { numero: 102, idHabitacion: habitacionId, idHospedaje: hospedajeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.numero).toEqual("102");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/habitaciones/hospedaje/:id", () => {
    // ID inválido
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/admin/habitaciones/hospedaje/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Hospedaje sin habitaciones
    (0, globals_1.test)("Debería retornar 404 - no hay habitaciones", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/admin/habitaciones/hospedaje/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Obtener habitaciones correctamente
    (0, globals_1.test)("Debería retornar 200 - listado de habitaciones", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/admin/habitaciones/hospedaje/${hospedajeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
        (0, globals_1.expect)(response.body[0]).toHaveProperty("idHabitacion");
        (0, globals_1.expect)(response.body[0]).toHaveProperty("numero");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/actividades/agregar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/actividades/agregar')
            .send({ nombre: "Actividad Test" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Sin autenticación
    (0, globals_1.test)("Debería retornar 401 - sin token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/actividades/agregar')
            .send(helperData_1.actividad);
        (0, globals_1.expect)(response.statusCode).toEqual(401);
    }));
    // Datos correctos
    (0, globals_1.test)("Debería retornar 201 - actividad creada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/actividades/agregar')
            .send(helperData_1.actividad)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        actividadId = response.body.idActividad;
        (0, globals_1.expect)(response.statusCode).toEqual(201);
        (0, globals_1.expect)(response.body).toHaveProperty("idActividad");
        (0, globals_1.expect)(response.body.nombre).toEqual("Tour de Senderismo en la Quebrada");
        (0, globals_1.expect)(response.body.ciudad).toEqual("Tucuman");
        (0, globals_1.expect)(response.body.precio).toEqual(3500);
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/actividades/modificar", () => {
    // Formato de datos incorrecto
    (0, globals_1.test)("Debería retornar 403 - datos incompletos", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/actividades/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.actividad), { IdActividad: actividadId, Nombre: "Nueva actividad" }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // ID incorrecto
    (0, globals_1.test)("Debería retornar 404 - actividad no encontrada", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/actividades/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.actividad), { idActividad: fakeId, nombre: "Nueva actividad" }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Modificación correcta
    (0, globals_1.test)("Debería retornar 200 - actividad modificada", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put('/api/admin/actividades/modificar')
            .send(Object.assign(Object.assign({}, helperData_1.actividad), { idActividad: actividadId, nombre: "Senderismo Avanzado", precio: 5000 }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.nombre).toEqual("Senderismo Avanzado");
        (0, globals_1.expect)(response.body.precio).toEqual(5000);
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/actividades", () => {
    // Obtener actividades
    (0, globals_1.test)("Debería retornar 200 - listado de actividades", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/admin/actividades')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/habitaciones/eliminar/:id", () => {
    // ID inválido
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/admin/habitaciones/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Habitación no encontrada
    (0, globals_1.test)("Debería retornar 404 - habitación no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/habitaciones/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Eliminación correcta
    (0, globals_1.test)("Debería retornar 200 - habitación eliminada", () => __awaiter(void 0, void 0, void 0, function* () {
        // Crear una habitación para eliminar
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/habitaciones/agregar')
            .send(Object.assign(Object.assign({}, helperData_1.habitacion), { idHospedaje: hospedajeId }))
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const IdHabitacionAEliminar = createResponse.body.idHabitacion;
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/habitaciones/eliminar/${IdHabitacionAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.success).toBe(true);
        (0, globals_1.expect)(response.body.message).toContain("exitosamente");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/actividades/eliminar/:id", () => {
    // ID inválido
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/admin/actividades/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Actividad no encontrada
    (0, globals_1.test)("Debería retornar 500 - actividad no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/actividades/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(500);
    }));
    // Eliminación correcta
    (0, globals_1.test)("Debería retornar 200 - actividad eliminada", () => __awaiter(void 0, void 0, void 0, function* () {
        // Crear una actividad para eliminar
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/actividades/agregar')
            .send(helperData_1.actividad)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const actividadAEliminar = createResponse.body.idActividad;
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/actividades/eliminar/${actividadAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.success).toBe(true);
        (0, globals_1.expect)(response.body.message).toContain("exitosamente");
    }));
});
(0, globals_1.describe)("[ADMIN] Pruebas de /api/admin/hospedajes/eliminar/:id", () => {
    // ID inválido
    (0, globals_1.test)("Debería retornar 403 - formato de ID no válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/admin/hospedajes/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(403);
    }));
    // Hospedaje no encontrado
    (0, globals_1.test)("Debería retornar 404 - hospedaje no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = crypto_1.default.randomUUID();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/hospedajes/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(404);
    }));
    // Eliminación correcta
    (0, globals_1.test)("Debería retornar 200 - hospedaje eliminado", () => __awaiter(void 0, void 0, void 0, function* () {
        // Crear un hospedaje para eliminar
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/admin/hospedajes/agregar')
            .send(helperData_1.hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        const hospedajeAEliminar = createResponse.body.idHospedaje;
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/admin/hospedajes/eliminar/${hospedajeAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);
        (0, globals_1.expect)(response.statusCode).toEqual(200);
        (0, globals_1.expect)(response.body.success).toBe(true);
        (0, globals_1.expect)(response.body.message).toContain("exitosamente");
    }));
});
//# sourceMappingURL=03_admin.test.js.map