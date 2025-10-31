import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getFotos(req: Request, res: Response) {
    try{
        const data = req.params;
        const id = <string>data.id;
    
        const fotos = await prisma.fotos.findMany({
            where: {
                idHospedaje: id
            }
        });
    
        if(fotos.length == 0) return handleHttpError(res, "No hay fotos para esta consulta", 404);
    
        res.status(200).json(fotos);
    } catch (error) {
    return handleHttpError(res, "Error al obtener fotos", 500);
    }
}