import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function agregarHospedaje(req: Request, res: Response) {
  try {
    const dataHospedaje = matchedData(req);

    const nuevoHospedaje = await prisma.hospedaje.create({ 
      data: { 
        titulo: String(dataHospedaje.nombre),
        descripcion: String(dataHospedaje.apellido), 
        servicios: String(dataHospedaje.email),
        estrellas: Number(dataHospedaje.telefono),
        telefono: String(dataHospedaje.telefono),
        ciudad: String(dataHospedaje.email),
        direccion: String(dataHospedaje.telefono),
        coordenadas: String(dataHospedaje.coordenadas),
        imagen: String(dataHospedaje.image),
        destacado: false
      } 
    });
        
    return res.status(201).json(nuevoHospedaje);
  } catch(error){
        handleHttpError(res, "Error al crear hospedaje", 500);
        return;
  }
}

export async function modificarHospedaje(req: Request, res: Response) {
  try {
   
  } catch(error){
    handleHttpError(res, "Error al obtener datos del usuario", 500);
    return;
  }
}

export async function eliminarHospedaje(req: Request, res: Response) {
  try {
   
  } catch(error){
    handleHttpError(res, "Error al obtener datos del usuario", 500);
    return;
  }
}