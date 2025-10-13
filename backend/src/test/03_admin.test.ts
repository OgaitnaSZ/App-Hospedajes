import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import crypto from 'crypto';
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
import { actividad, habitacion, hospedaje, userLoginAdmin } from "./helper/helperData";

let JWT_TOKEN = "";
let hospedajeId: string;
let habitacionId: string;
let actividadId: string;

beforeAll(async () => {
    // Limpiar datos de pruebas anteriores
    await prisma.actividades.deleteMany();
    await prisma.habitaciones.deleteMany();
    await prisma.fotos.deleteMany();
    await prisma.reservas_hospedajes.deleteMany();
    await prisma.resena.deleteMany();
    await prisma.hospedaje.deleteMany();

    // Login de usuario administrador
    const response = await request(app)
        .post('/api/auth/login')
        .send(userLoginAdmin);

    JWT_TOKEN = response.body.data.token;
});

describe("[ADMIN] Pruebas de /api/admin/hospedajes/agregar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/admin/hospedajes/agregar')
            .send({ titulo: "Hospedaje Test" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Sin autenticación
    test("Debería retornar 401 - sin token", async () => {
        const response = await request(app)
            .post('/api/admin/hospedajes/agregar')
            .send(hospedaje);

        expect(response.statusCode).toEqual(401);
    });

    // Datos correctos
    test("Debería retornar 201 - hospedaje creado", async () => {
        const response = await request(app)
            .post('/api/admin/hospedajes/agregar')
            .send(hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        hospedajeId = response.body.idHospedaje;

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("idHospedaje");
        expect(response.body).toHaveProperty("titulo");
        expect(response.body.titulo).toEqual("Hotel en Santiago");
        expect(response.body.estrellas).toEqual(4);
        expect(response.body.ciudad).toEqual("Santiago");
    });
});

describe("[ADMIN] Pruebas de /api/admin/hospedajes/modificar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .put('/api/admin/hospedajes/modificar')
            .send({ titulo: "Nuevo Título" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // ID incorrecto
    test("Debería retornar 404 - hospedaje no encontrado", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .put('/api/admin/hospedajes/modificar')
            .send({ ...hospedaje, idHospedaje: fakeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Modificación correcta
    test("Debería retornar 200 - hospedaje modificado", async () => {
        const response = await request(app)
            .put('/api/admin/hospedajes/modificar')
            .send({ ...hospedaje, titulo: "Hospedaje modificado", idHospedaje: hospedajeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.titulo).toEqual("Hospedaje modificado");
    });
});

describe("[ADMIN] Pruebas de /api/admin/habitaciones/agregar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/admin/habitaciones/agregar')
            .send({ Numero: "101" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Sin autenticación
    test("Debería retornar 401 - sin token", async () => {
        const response = await request(app)
            .post('/api/admin/habitaciones/agregar')
            .send({ ...habitacion, idHospedaje: hospedajeId });

        expect(response.statusCode).toEqual(401);
    });

    // Datos correctos
    test("Debería retornar 201 - habitación creada", async () => {
        const response = await request(app)
            .post('/api/admin/habitaciones/agregar')
            .send({ ...habitacion, idHospedaje: hospedajeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        habitacionId = response.body.idHabitacion;

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("idHabitacion");
        expect(response.body.numero).toEqual("101");
        expect(response.body.tipo).toEqual("suite");
        expect(response.body.precio).toEqual(400);
        expect(response.body.capacidad).toEqual(4);
    });
});

describe("[ADMIN] Pruebas de /api/admin/habitaciones/modificar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .put('/api/admin/habitaciones/modificar')
            .send({ numero: "102" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // ID incorrecto
    test("Debería retornar 404 - habitación no encontrada", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .put('/api/admin/habitaciones/modificar')
            .send({
                idHabitacion: fakeId,
                ... habitacion,
                idHospedaje: hospedajeId,
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Modificación correcta
    test("Debería retornar 200 - habitación modificada", async () => {
        const response = await request(app)
            .put('/api/admin/habitaciones/modificar')
            .send({ ...habitacion, numero: 102, idHabitacion: habitacionId, idHospedaje: hospedajeId })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.numero).toEqual("102");
    });
});

describe("[ADMIN] Pruebas de /api/admin/habitaciones/hospedaje/:id", () => {
    // ID inválido
    test("Debería retornar 403 - formato de ID no válido", async () => {
        const response = await request(app)
            .get('/api/admin/habitaciones/hospedaje/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Hospedaje sin habitaciones
    test("Debería retornar 404 - no hay habitaciones", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .get(`/api/admin/habitaciones/hospedaje/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Obtener habitaciones correctamente
    test("Debería retornar 200 - listado de habitaciones", async () => {
        const response = await request(app)
            .get(`/api/admin/habitaciones/hospedaje/${hospedajeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("idHabitacion");
        expect(response.body[0]).toHaveProperty("numero");
    });
});

describe("[ADMIN] Pruebas de /api/admin/actividades/agregar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .post('/api/admin/actividades/agregar')
            .send({ nombre: "Actividad Test" })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Sin autenticación
    test("Debería retornar 401 - sin token", async () => {
        const response = await request(app)
            .post('/api/admin/actividades/agregar')
            .send(actividad);

        expect(response.statusCode).toEqual(401);
    });

    // Datos correctos
    test("Debería retornar 201 - actividad creada", async () => {
        const response = await request(app)
            .post('/api/admin/actividades/agregar')
            .send(actividad)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        actividadId = response.body.idActividad;

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("idActividad");
        expect(response.body.nombre).toEqual("Tour de Senderismo en la Quebrada");
        expect(response.body.ciudad).toEqual("Tucuman");
        expect(response.body.precio).toEqual(3500);
    });
});

describe("[ADMIN] Pruebas de /api/admin/actividades/modificar", () => {
    // Formato de datos incorrecto
    test("Debería retornar 403 - datos incompletos", async () => {
        const response = await request(app)
            .put('/api/admin/actividades/modificar')
            .send({ 
                ...actividad, 
                IdActividad: actividadId, 
                Nombre: "Nueva actividad" 
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // ID incorrecto
    test("Debería retornar 404 - actividad no encontrada", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .put('/api/admin/actividades/modificar')
            .send({ 
                ...actividad, 
                idActividad: fakeId, 
                nombre: "Nueva actividad" 
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Modificación correcta
    test("Debería retornar 200 - actividad modificada", async () => {
        const response = await request(app)
            .put('/api/admin/actividades/modificar')
            .send({ 
                ...actividad, 
                idActividad: actividadId, 
                nombre: "Senderismo Avanzado",
                precio: 5000
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.nombre).toEqual("Senderismo Avanzado");
        expect(response.body.precio).toEqual(5000);
    });
});

describe("[ADMIN] Pruebas de /api/admin/actividades", () => {
    // Obtener actividades
    test("Debería retornar 200 - listado de actividades", async () => {
        const response = await request(app)
            .get('/api/admin/actividades')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("[ADMIN] Pruebas de /api/admin/habitaciones/eliminar/:id", () => {
    // ID inválido
    test("Debería retornar 403 - formato de ID no válido", async () => {
        const response = await request(app)
            .delete('/api/admin/habitaciones/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Habitación no encontrada
    test("Debería retornar 404 - habitación no existe", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .delete(`/api/admin/habitaciones/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Eliminación correcta
    test("Debería retornar 200 - habitación eliminada", async () => {
        // Crear una habitación para eliminar
        const createResponse = await request(app)
            .post('/api/admin/habitaciones/agregar')
            .send({
                ... habitacion,
                idHospedaje: hospedajeId
            })
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const IdHabitacionAEliminar = createResponse.body.idHabitacion;

        const response = await request(app)
            .delete(`/api/admin/habitaciones/eliminar/${IdHabitacionAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain("exitosamente");
    });
});

describe("[ADMIN] Pruebas de /api/admin/actividades/eliminar/:id", () => {
    // ID inválido
    test("Debería retornar 403 - formato de ID no válido", async () => {
        const response = await request(app)
            .delete('/api/admin/actividades/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Actividad no encontrada
    test("Debería retornar 500 - actividad no existe", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .delete(`/api/admin/actividades/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(500);
    });

    // Eliminación correcta
    test("Debería retornar 200 - actividad eliminada", async () => {
        // Crear una actividad para eliminar
        const createResponse = await request(app)
            .post('/api/admin/actividades/agregar')
            .send(actividad)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const actividadAEliminar = createResponse.body.idActividad;

        const response = await request(app)
            .delete(`/api/admin/actividades/eliminar/${actividadAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain("exitosamente");
    });
});

describe("[ADMIN] Pruebas de /api/admin/hospedajes/eliminar/:id", () => {
    // ID inválido
    test("Debería retornar 403 - formato de ID no válido", async () => {
        const response = await request(app)
            .delete('/api/admin/hospedajes/eliminar/123')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    });

    // Hospedaje no encontrado
    test("Debería retornar 404 - hospedaje no existe", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .delete(`/api/admin/hospedajes/eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    });

    // Eliminación correcta
    test("Debería retornar 200 - hospedaje eliminado", async () => {
        // Crear un hospedaje para eliminar
        const createResponse = await request(app)
            .post('/api/admin/hospedajes/agregar')
            .send(hospedaje)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const hospedajeAEliminar = createResponse.body.idHospedaje;

        const response = await request(app)
            .delete(`/api/admin/hospedajes/eliminar/${hospedajeAEliminar}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain("exitosamente");
    });
});