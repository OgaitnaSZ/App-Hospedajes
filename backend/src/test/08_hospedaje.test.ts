import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
import { habitacion, hospedaje, userLoginAdmin } from "./helper/helperData";

let JWT_TOKEN = "";
let user: any;
let hospedajeId: string;
let habitacionId: string;

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

    // Crear reserva de hospedaje para las pruebas
    const preferenciaDePago = `PREF_HOSPEDAJE_${Date.now()}`;

    const reservaResponse = await request(app)
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
});

describe("[Hospedaje] Pruebas de /api/hospedaje/hospedajes", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
        .get('/api/hospedaje/hospedajes?ciudad=1111111111111111111111111111111111111111111111111111')

        expect(response.statusCode).toEqual(403);
    });


    // No hay hospedajes disponibles con los filtros seleccionados
    test("Debería retornar 404", async () => {
        const response = await request(app)
        .get('/api/hospedaje/hospedajes?ciudad=Santiago&fechaInicio=2026-01-01&fechaFin=2026-01-05&capacidad=5')

        expect(response.statusCode).toEqual(404);
    });

    // Mostrar hospedajes
    test("Debería retornar 200 - datos incompletos", async () => {
        const response = await request(app)
        .get('/api/hospedaje/hospedajes?ciudad=Santiago&fechaInicio=2026-01-01&fechaFin=2026-01-05')

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("idHospedaje");
        expect(response.body[0]).toHaveProperty("titulo");
        expect(response.body[0].ciudad).toEqual("Santiago");
    });
});

describe("[Hospedaje] Pruebas de /api/hospedaje/hospedaje/:id", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
        .get('/api/hospedaje/hospedaje/123')

        expect(response.statusCode).toEqual(403);
    });


    // Hospedaje no existe
    test("Debería retornar 404 - hospedaje no existe", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
        .get(`/api/hospedaje/hospedaje/${fakeId}`)

        expect(response.statusCode).toEqual(404);
    });

    // Mostrar hospedajes
    test("Debería retornar 200 - datos incompletos", async () => {
        const response = await request(app)
        .get(`/api/hospedaje/hospedaje/${hospedajeId}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("idHospedaje");
        expect(response.body).toHaveProperty("titulo");
        expect(response.body.ciudad).toEqual("Santiago");
    });
});

describe("[Hospedaje] Pruebas de /api/hospedaje/destacados", () => {
    // No hay destacados
    test("Debería retornar 404 - no hay destacados", async () => {
        const response = await request(app)
        .get(`/api/hospedaje/destacados`)

        expect(response.statusCode).toEqual(404);
    });

    // Mostrar hospedajes
    test("Debería retornar 200 - datos incompletos", async () => {
        // Destacar hospedaje
        await prisma.hospedaje.updateMany({
            where: { idHospedaje: hospedajeId },
            data: { destacado: true },
        });

        const response = await request(app)
        .get(`/api/hospedaje/destacados`)

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("idHospedaje");
        expect(response.body[0]).toHaveProperty("titulo");
    });
});