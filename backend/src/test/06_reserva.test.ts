import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import crypto from 'crypto';
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
import { actividad, habitacion, hospedaje, userLoginAdmin } from "./helper/helperData";

let JWT_TOKEN = "";
let user: any;
let hospedajeId: string;
let habitacionId: string;
let actividadId: string;
let reservaHospedajeId: string;
let reservaActividadId: string;
let pagoHospedajeId: string;
let pagoActividadId: string;
let preferenciaPagoHospedaje: string;
let preferenciaPagoActividad: string;

beforeAll(async () => {
    await prisma.resena.deleteMany();
    await prisma.pagos_actividades.deleteMany();
    await prisma.pagos_hospedajes.deleteMany();
    await prisma.reservas_hospedajes.deleteMany();
    await prisma.reservas_actividades.deleteMany();
    await prisma.habitaciones.deleteMany();
    await prisma.fotos.deleteMany();
    await prisma.hospedaje.deleteMany();
    await prisma.actividades.deleteMany();

    // Login de usuario
    const response = await request(app)
        .post('/api/auth/login')
        .send(userLoginAdmin);

    user = response.body.data.user;
    JWT_TOKEN = response.body.data.token;

    // Crear hospedaje para las pruebas
    const hospedajeResponse = await request(app)
        .post('/api/admin/hospedajes/agregar')
        .send(hospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

    hospedajeId = hospedajeResponse.body.idHospedaje;

    // Crear habitación para las pruebas
    const habitacionResponse = await request(app)
        .post('/api/admin/habitaciones/agregar')
        .send({... habitacion, idHospedaje: hospedajeId })
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

    habitacionId = habitacionResponse.body.idHabitacion;

    // Crear actividad para las pruebas
    const actividadResponse = await request(app)
        .post('/api/admin/actividades/agregar')
        .send(actividad)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

    actividadId = actividadResponse.body.idActividad;
});

describe("[RESERVA] Pruebas de /api/reserva/reservar-hospedaje", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/reservar-hospedaje')
            .send({ idHospedaje: hospedajeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Sin autenticación
    test("Debería retornar 401 - sin token", async () => {
        const response = await request(app)
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

        expect(response.statusCode).toEqual(401);
    });

    // Reserva correcta
    test("Debería retornar 201 - hospedaje reservado", async () => {
        preferenciaPagoHospedaje = `PREF_HOSPEDAJE_${Date.now()}`;
        
        const response = await request(app)
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

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("nuevaReserva");
        expect(response.body).toHaveProperty("nuevoPago");
        expect(response.body.nuevaReserva).toHaveProperty("idReserva");
        expect(response.body.nuevaReserva.estado).toEqual("pendiente");
        expect(response.body.nuevoPago.estado).toEqual("pendiente");
        expect(response.body.nuevaReserva.precioTotal).toEqual(600);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/reservar-actividad", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/reservar-actividad')
            .send({ idActividad: actividadId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Sin autenticación
    test("Debería retornar 401 - sin token", async () => {
        const response = await request(app)
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

        expect(response.statusCode).toEqual(401);
    });

    // Reserva de actividad correcta
    test("Debería retornar 201 - actividad reservada", async () => {
        preferenciaPagoActividad = `PREF_ACTIVIDAD_${Date.now()}`;
        
        const response = await request(app)
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

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("nuevaReserva");
        expect(response.body).toHaveProperty("nuevoPago");
        expect(response.body.nuevaReserva).toHaveProperty("idReserva");
        expect(response.body.nuevaReserva.estado).toEqual("pendiente");
        expect(response.body.nuevoPago.estado).toEqual("pendiente");
        expect(response.body.nuevaReserva.precioTotal).toEqual(300);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/reserva", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/reserva')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Reserva no encontrada
    test("Debería retornar 404 - reserva no encontrada", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .post('/api/reserva/reserva')
            .send({ id: fakeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Reserva no encontrada
    test("Debería retornar 401 - No inicio session", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .post('/api/reserva/reserva')
            .send({ id: fakeId, tipo: "hospedaje" })

        expect(response.statusCode).toEqual(401);
    });

    // Obtener reserva de hospedaje
    test("Debería retornar 200 - reserva de hospedaje obtenida", async () => {
        const response = await request(app)
            .post('/api/reserva/reserva')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("idReserva");
        expect(response.body.idReserva).toEqual(reservaHospedajeId);
        expect(response.body.estado).toEqual("pendiente");
    });

    // Obtener reserva de actividad
    test("Debería retornar 200 - reserva de actividad obtenida", async () => {
        const response = await request(app)
            .post('/api/reserva/reserva')
            .send({ id: reservaActividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("idReserva");
        expect(response.body.idReserva).toEqual(reservaActividadId);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/reservas-usuario", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/reservas-usuario')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Obtener reservas de hospedaje del usuario
    test("Debería retornar 200 - reservas de hospedaje del usuario", async () => {
        const response = await request(app)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("hospedaje");
        expect(response.body[0]).toHaveProperty("habitaciones");
    });

    // Obtener reservas de actividad del usuario
    test("Debería retornar 200 - reservas de actividad del usuario", async () => {
        const response = await request(app)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("actividades");
    });

    // No inicio session o no es el usuario
    test("Debería retornar 401 - no autirizado", async () => {
        const response = await request(app)
            .post('/api/reserva/reservas-usuario')
            .send({ id: user.idUsuario, tipo: "actividad" })

        expect(response.statusCode).toEqual(401);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/fechas-ocupadas", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/fechas-ocupadas')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Not session
    test("Debería retornar 401 - no inicio session", async () => {
        const response = await request(app)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: hospedajeId, tipo: "hospedaje" })

        expect(response.statusCode).toEqual(401);
    });

    // Fechas ocupadas de hospedaje
    test("Debería retornar 200 - fechas ocupadas de hospedaje", async () => {
        const response = await request(app)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: hospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("fechaInicio");
        expect(response.body[0]).toHaveProperty("fechaFin");
    });

    // Fechas ocupadas de actividad
    test("Debería retornar 200 - fechas ocupadas de actividad", async () => {
        const response = await request(app)
            .post('/api/reserva/fechas-ocupadas')
            .send({ id: actividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("fecha");
    });
});

describe("[RESERVA] Pruebas de /api/reserva/verificar-pago-hospedaje", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Pago no encontrado
    test("Debería retornar 404 - pago no encontrado", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: "PREF_NO_EXISTE" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // No inicio session
    test("Debería retornar 401", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: preferenciaPagoHospedaje })

        expect(response.statusCode).toEqual(401);
    });

    // Verificar pago
    test("Debería retornar 200 - pago aprobado", async () => {
        // Aprobar pago
        await prisma.pagos_hospedajes.updateMany({
            where: { idPreferencia: preferenciaPagoHospedaje },
            data: { estado: 'aprobado' },
        });

        const response = await request(app)
            .post('/api/reserva/verificar-pago-hospedaje')
            .send({ idPreferencia: preferenciaPagoHospedaje })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/verificar-pago-actividad", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-actividad')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Pago no encontrado
    test("Debería retornar 404 - pago no encontrado", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: "PREF_NO_EXISTE" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // No inicio session
    test("Debería retornar 401", async () => {
        const response = await request(app)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: preferenciaPagoActividad })

        expect(response.statusCode).toEqual(401);
    });

    // Verificar pago
    test("Debería retornar 200 - pago aprobado", async () => {
        // Aprobar pago
        await prisma.pagos_actividades.updateMany({
            where: { idPreferencia: preferenciaPagoActividad },
            data: { estado: 'aprobado' },
        });

        const response = await request(app)
            .post('/api/reserva/verificar-pago-actividad')
            .send({ idPreferencia: preferenciaPagoActividad })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
    });
});

describe("[RESERVA] Pruebas de /api/reserva/cancelar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/reserva/cancelar')
            .send({})
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Reserva no encontrada
    test("Debería retornar 404 - reserva no encontrada", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .post('/api/reserva/cancelar')
            .send({ id: fakeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // No inicio session
    test("Debería retornar 401", async () => {
        const response = await request(app)
            .post('/api/reserva/cancelar')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" })

        expect(response.statusCode).toEqual(401);
    });

    // Cancelar reserva de hospedaje
    test("Debería retornar 200 - reserva de hospedaje cancelada", async () => {
        const response = await request(app)
            .post('/api/reserva/cancelar')
            .send({ id: reservaHospedajeId, tipo: "hospedaje" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.estado).toEqual("pendiente_de_cancelacion");
    });

    // Cancelar reserva de actividad
    test("Debería retornar 200 - reserva de actividad cancelada", async () => {
        const response = await request(app)
            .post('/api/reserva/cancelar')
            .send({ id: reservaActividadId, tipo: "actividad" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.estado).toEqual("pendiente_de_cancelacion");
    });
});