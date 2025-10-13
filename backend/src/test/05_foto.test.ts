import { describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
import { hospedaje, userLoginAdmin } from './helper/helperData';

let JWT_TOKEN = "";
let idHospedaje: string;
const filePath = `${__dirname}/dump/hotel.jpg`;
let fotoSubida: string;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    prisma.fotos.deleteMany();

    // Login de usuario administrador
    const response = await request(app)
        .post('/api/auth/login')
        .send(userLoginAdmin);

    JWT_TOKEN = response.body.data.token;

    // Crear un hospedaje
    const createResponse = await request(app)
        .post('/api/admin/hospedajes/agregar')
        .send(hospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);
    
    idHospedaje = createResponse.body.idHospedaje;
})

describe("[Foto] Pruebas de /api/foto/subir", () => {
    // No se inicio session o no es administrador
    test("Debería retornar 401", async () => {
        const response = await request(app)
        .post('/api/foto/subir')
        .field("idHospedaje", idHospedaje)
        // .attach("archivos", filePath); Problema con node

        expect(response.statusCode).toEqual(401);
    });

    // No hay archivos
    test("Debería retornar 400 - no se subieron archivos", async () => {
        const response = await request(app)
        .post('/api/foto/subir')
        .field("idHospedaje", idHospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(400);
    });

    // Fotos subidas correctamente
    test("Debería retornar 201", async () => {
        const response = await request(app)
        .post('/api/foto/subir')
        .field("idHospedaje", idHospedaje)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .attach("fotos", filePath);

        expect(response.statusCode).toEqual(201);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data[0]).toHaveProperty("path");
        expect(response.body.data[0].idHospedaje).toEqual(idHospedaje);

        fotoSubida = response.body.data[0];
    });
});

describe("[Foto] Pruebas de /api/foto/hospedaje/{id}", () => {
    // ID formato de ID incorrecto
    test("Debería retornar 403 - formato de ID no válido", async () => {
        const response = await request(app)
            .get('/api/foto/hospedaje/123')

        expect(response.statusCode).toEqual(403);
    });

    // ID de hospedaje no existe
    test("Debería retornar 404 - no existe el hospedaje", async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app)
            .get(`/api/foto/hospedaje/${fakeId}`)

        expect(response.statusCode).toEqual(404);
    });

    // Hospedaje sin fotos
    test("Debería retornar 404 - el hospedaje no tien fotos", async () => {
        // Crear un hospedaje
        const createResponse = await request(app)
            .post('/api/admin/hospedajes/agregar')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send(hospedaje);
        
        const idHospedajeSinFoto = createResponse.body.idHospedaje;

        const response = await request(app)
            .get(`/api/foto/hospedaje/${idHospedajeSinFoto}`)

        expect(response.statusCode).toEqual(404);
    });

    // Hospedaje con fotos
    test("Debería retornar 200 - fotos del hospedaje", async () => {
        const response = await request(app)
        .get(`/api/foto/hospedaje/${idHospedaje}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("idFoto");
        expect(response.body[0]).toHaveProperty("path");
        expect(response.body[0].idHospedaje).toEqual(idHospedaje);
    });
});