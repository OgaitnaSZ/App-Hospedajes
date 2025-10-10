import { beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";
import { userRegister, userLogin } from "./helper/helperData";
import { usuario } from '@prisma/client';
import crypto from 'crypto';
let JWT_TOKEN = "";
let user:usuario;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    //await prisma.usuario.deleteMany();
    
    const response = await request(app)
        .post('/api/auth/register')
        .send(userRegister);
        
    JWT_TOKEN = response.body.data.token;
})

describe("[AUTH] esta es la prueba de /api/auth/register", ()=>{
    // Usuario correcto
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/auth/register')
        .send(userRegister);

        const { body } = response;

        expect(response.statusCode).toEqual(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("token");
        expect(body.data).toHaveProperty("user");

        user = body.data.user;
    })

    // Formato incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userRegister, email: "testing"});

        expect(response.statusCode).toEqual(403);
    })

    // Email ya registrado
    test("Esto deberia retornar 404", async ()=>{
        const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userRegister, email: "testing@gmail.com"});

        expect(response.statusCode).toEqual(404);
    })
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

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("token");
        expect(body.data).toHaveProperty("user");
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

describe("[AUTH] esta es la prueba de /api/auth/update-password", ()=>{
    // Sin session activa u otro usuario logeado
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/auth/update-password')
        .send({ idUsuario: user.idUsuario , password: user.password, newPassword: "123456"});

        expect(response.statusCode).toEqual(403);
    })

    // Usuario no existe
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = crypto.randomUUID();
        const response = await request(app)
        .post('/api/auth/update-password')
        .send({ idUsuario: fakeId , password: user.password, newPassword: "123456"})
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(404);
    })

    // Password erronea
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/auth/update-password')
        .send({ idUsuario: user.idUsuario , password: "111111111", newPassword: "123456"})
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(400);
    })

    // Password correcta
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/auth/update-password')
        .send({ idUsuario: user.idUsuario , password: user.password, newPassword: "123456"})
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        expect(body).toHaveProperty("updatedUser");
    })
})

describe("[AUTH] esta es la prueba de /api/auth/recover-password", ()=>{
    // Email no registrado
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/auth/recover-password')
        .send({email: "testttt123@gmail.com"});

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        user = body.data.message;
    })

    // Formato incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/auth/recover-password')
        .send({ email: "testttt123"});

        expect(response.statusCode).toEqual(403);
    })

    // Email correcto
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/auth/recover-password')
        .send({email: user.email});

        const { body } = response;

        expect(response.statusCode).toEqual(200);
        user = body.data.message;
    })
})

describe("[AUTH] esta es la prueba de /api/auth/reset-password", ()=>{
    // Token no valido o expirado
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/auth/reset-password')
        .send({password: "123456", token: ""});

        const { body } = response;

        expect(response.statusCode).toEqual(400);
    })

    // Formato incorrecto
    test("Esto deberia retornar 403", async ()=>{
        const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ password: "", token: ""});

        expect(response.statusCode).toEqual(403);
    })
})