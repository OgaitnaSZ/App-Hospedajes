import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getServicios(req: Request, res: Response) {
  try {
    const data = matchedData(req);
    const tipo = data.Tipo;

    const servicios = await prisma.servicios.findMany({
        where: { tipo: tipo }
    })

    res.status(200).json(servicios);
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}