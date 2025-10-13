import { describe, expect, test } from '@jest/globals';
import request from "supertest";
import app from "../app";

describe("[Servicio] Pruebas de /api/servicio/", () => {
    // Tipo no valido
    test("Debería retornar 403 - tipo de servicio incorrecto", async () => {
        const response = await request(app)
            .get('/api/servicio?tipo=any')

        expect(response.statusCode).toEqual(403);
    });

    // Tipo hospedaje
    test("Debería retornar 200 - servicios de hospedaje", async () => {
        const response = await request(app)
            .get('/api/servicio?tipo=hospedaje')

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].tipo).toEqual("hospedaje")
        expect(response.body[0]).toHaveProperty("nombre");
        expect(response.body[0]).toHaveProperty("descripcion");
    });

    // Tipo habitacion
    test("Debería retornar 200 - servicios de habitacion", async () => {
        const response = await request(app)
            .get('/api/servicio?tipo=habitacion')

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].tipo).toEqual("habitacion")
        expect(response.body[0]).toHaveProperty("nombre");
        expect(response.body[0]).toHaveProperty("descripcion");
    });
});