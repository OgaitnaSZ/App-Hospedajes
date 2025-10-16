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
let resena: any;

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

describe("[Reseña] Pruebas de /api/resena/agregar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/resena/agregar')
            .send({ idUsuario: user.idUsuario })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // No inicio sesion o no esta autorizado
    test("Debería retornar 401 - no autorizado", async () => {
        const response = await request(app)
            .post('/api/resena/agregar')
            .send({ 
                idUsuario: user.idUsuario,
                idHospedaje: hospedajeId,
                idHabitacion: habitacionId,
                calificacion: 5,
                comentario: "Exelente."
            })

        expect(response.statusCode).toEqual(401);
    });

    // Creacion de resena
    test("Debería retornar 201", async () => {
        const response = await request(app)
            .post('/api/resena/agregar')
            .send({ 
                idUsuario: user.idUsuario,
                idHospedaje: hospedajeId,
                idHabitacion: habitacionId,
                calificacion: 5,
                comentario: "Exelente."
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("idUsuario");
        expect(response.body).toHaveProperty("idResena");
        expect(response.body.idHospedaje).toEqual(hospedajeId);
        expect(response.body.calificacion).toEqual(5);

        resena = response.body;
    });
});

describe("[Reseña] Pruebas de /api/resena/actualizar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .put('/api/resena/actualizar')
            .send({ idUsuario: user.idUsuario })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // No inicio sesion o no esta autorizado
    test("Debería retornar 401 - no autorizado", async () => {
        const response = await request(app)
            .put('/api/resena/actualizar')
            .send({ ...resena, calificacion: 2 })

        expect(response.statusCode).toEqual(401);
    });

    // Reseña inexistente
    test("Debería retornar 404", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .put('/api/resena/actualizar')
            .send({ ...resena, idResena: fakeId, calificacion: 2 })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Reseña correcta
    test("Debería retornar 200", async () => {
        const response = await request(app)
            .put('/api/resena/actualizar')
            .send({ ...resena, calificacion: 2 })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("idResena");
        expect(response.body.calificacion).toEqual(2);
    });
});

describe("[Reseña] Pruebas de /resena/usuario/{idUsuario}/hospedaje/{idHospedaje}/habitacion/{idHabitacion}", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - formato incorrecto", async () => {
        const response = await request(app)
            .get('/api/resena/usuario/123/hospedaje/123/habitacion/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // No inicio session o usuario incorrecto
    test("Debería retornar 401", async () => {
        const response = await request(app)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${hospedajeId}/habitacion/${habitacionId}`)

        expect(response.statusCode).toEqual(401);
    });

    // Resena no existente
    test("Debería retornar 404", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${fakeId}/habitacion/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Obtener reseña
    test("Debería retornar 200 ", async () => {
        const response = await request(app)
            .get(`/api/resena/usuario/${user.idUsuario}/hospedaje/${hospedajeId}/habitacion/${habitacionId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
    });
});

describe("[Reseña] Pruebas de /resena/hospedaje/:id", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - formato incorrecto", async () => {
        const response = await request(app)
            .get('/api/resena/hospedaje/10')

        expect(response.statusCode).toEqual(403);
    });

    // No existe el hospedaje
    test("Debería retornar 404 ", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .get(`/api/resena/hospedaje/${fakeId}`)

        expect(response.statusCode).toEqual(404);
    });

    // Hospedaje sin resenas
    test("Debería retornar 404 ", async () => {
        const hospedajeResponse = await request(app)
        .post('/api/admin/hospedajes/agregar')
        .send(hospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const hospedajeId = hospedajeResponse.body.idHospedaje;
        
        const response = await request(app)
            .get(`/api/resena/hospedaje/${hospedajeId}`)

        expect(response.statusCode).toEqual(404);
    });

    // Obtener resenas
    test("Debería retornar 200", async () => {
        const response = await request(app)
            .get(`/api/resena/hospedaje/${hospedajeId}`)

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("idHospedaje");
        expect(response.body[0].idHospedaje).toEqual(hospedajeId);
    });
});


describe("[Reseña] Pruebas de /resena/mejores/:cantidad", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - formato incorrecto", async () => {
        const response = await request(app)
            .get('/api/resena/mejores/10')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // No hay reseñas de 4 o 5 puntos
    test("Debería retornar 404 ", async () => {
        const response = await request(app)
            .get('/api/resena/mejores/3')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Obtener mejores resenas
    test("Debería retornar 200", async () => {
        // Actualizar reseña para tener 5 puntos
        await request(app)
            .put('/api/resena/actualizar')
            .send({ ...resena, calificacion: 5 })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const response = await request(app)
            .get('/api/resena/mejores/3')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].usuario).toEqual(user.nombre);
        expect(response.body[0].calificacion).toEqual(5);
    });
});

describe("[Reseña] Pruebas de /resena/eliminar/:id", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - formato incorrecto", async () => {
        const response = await request(app)
        .delete(`/api/resena/eliminar/123`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // No inicio sesion
    test("Debería retornar 401 - no session o no permisos", async () => {
        const response = await request(app)
        .delete(`/api/resena/eliminar/${resena.idResena}`)

        expect(response.statusCode).toEqual(401);
    });

    // Eliminar reseña
    test("Debería retornar 200 - formato incorrecto", async () => {
        const response = await request(app)
        .delete(`/api/resena/eliminar/${resena.idResena}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain("exitosamente");
    });

    // Resena inexistente
    test("Debería retornar 404", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
        .delete(`/api/resena/eliminar/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });
});