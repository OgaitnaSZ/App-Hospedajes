import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()
import { userRegister, userLogin } from "./helper/helperData";
import { usuario } from '@prisma/client';
import crypto from 'crypto';
let JWT_TOKEN = "";
let user:usuario;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await prisma.suscripcionesNewsletter.deleteMany();

    const response = await request(app)
        .post('/api/auth/login')
        .send(userLogin);
        
    user = response.body.data.user;
    JWT_TOKEN = response.body.data.token;
})

describe("[USER] esta es la prueba de /api/user/get-data/:id", ()=>{
    // Formato de ID no valido
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .get('/api/user/get-data/123')
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    })

    // No inicio session o es otro usuario
    test("Esto deberia retornar 401", async ()=>{
        const fakeId = crypto.randomUUID();
        const response = await request(app)
        .get(`/api/user/get-data/${fakeId}`)

        expect(response.statusCode).toEqual(401);
    })

    // Usuario correcto
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get(`/api/user/get-data/${user.idUsuario}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        expect(body).toHaveProperty("nombre");
        expect(body).toHaveProperty("email");
        expect(body.nombre).toEqual(user.nombre);
        expect(body.email).toEqual(user.email);
    })
})

describe("[USER] esta es la prueba de /api/user/update-data", ()=>{
    // Formato de datos incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .put('/api/user/update-data')
        .send({nombre:"name test"})
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    })

    // No se puede modificar a otro usuario
    test("Esto deberia retornar 403", async ()=>{
        const fakeId = crypto.randomUUID();
        const response = await request(app)
        .put(`/api/user/update-data`)
        .send({... user, idUsuario: fakeId})
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(403);
    })

    // Usuario correcto
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .put(`/api/user/update-data`)
        .send({... user, nombre: "Santiago" })
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        expect(body).toHaveProperty("nombre");
        expect(body).toHaveProperty("email");
        expect(body.nombre).toEqual("Santiago");
    })
})

describe("[USER] esta es la prueba de /api/user/subscribe-email", ()=>{
    // Formato de datos incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/user/subscribe-email')
        .send({email:"name test"})

        expect(response.statusCode).toEqual(403);
    })

    // Email correcto
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/user/subscribe-email')
        .send({email: "test123@gmail.com"})

        expect(response.statusCode).toEqual(201);
    })

    // Email ya suscripto
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/user/subscribe-email')
        .send({email: "test123@gmail.com"})

        expect(response.statusCode).toEqual(400);
    })
})