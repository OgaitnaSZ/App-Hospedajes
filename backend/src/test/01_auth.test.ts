import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import { userRegister, userLogin } from "./helper/helperData";
let JWT_TOKEN = "";

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    //await prisma.usuario.deleteMany();
    
    const response = await request(app)
        .post('/api/auth/login')
        .send(userLogin);
        
    JWT_TOKEN = response.body.data.token;
})

describe("[AUTH] esta es la prueba de /api/auth/login", ()=>{
    // Password erronea
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/auth/login')
        .send({ ...userLogin , password: "111111111"});

        expect(response.statusCode).toEqual(400);
    })

    // Usuario correcto
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/auth/login')
        .send(userLogin);

        expect(response.statusCode).toEqual(200);
    })

    // Formato incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/auth/login')
        .send({ ...userLogin, email: "testing"});

        expect(response.statusCode).toEqual(403);
    })

    // Usuario no existe
    test("Esto deberia retornar 404", async ()=>{
        const response = await request(app)
        .post('/api/auth/login')
        .send({ ...userLogin, email: "testing@gmail.com"});

        expect(response.statusCode).toEqual(404);
    })
})