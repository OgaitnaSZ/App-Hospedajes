import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getHospedajes(req: Request, res: Response) {
    try{
        const { ciudad, fechaInicio, fechaFin, capacidad } = req.query;

        /*
            Busca hospedajes que tengan habitaciones con las siguientes condiciones:
                - Hospedaje de la ciudad seleccionada
                - NO reservadas entre las fechas seleccionadas
                - capacidad mayor o igual a la seleccionada
        */
        const hospedajes = await prisma.hospedaje.findMany({
          where: {
            ...(ciudad && { ciudad: String(ciudad) }),
            habitaciones: {
              some: {
                ...(capacidad && { capacidad: { gte: Number(capacidad) } }),
                ...(fechaInicio && fechaFin
                  ? {
                      reservas_hospedajes: {
                        none: {
                          fechaInicio: { lte: new Date(String(fechaFin)) },
                          fechaFin: { gte: new Date(String(fechaInicio)) },
                        },
                      },
                    }
                  : {}),
              },
            },
          },
          include: {
            habitaciones: {
              where: {
                ...(capacidad && { capacidad: { gte: Number(capacidad) } }),
                ...(fechaInicio && fechaFin
                  ? {
                      reservas_hospedajes: {
                        none: {
                          fechaInicio: { lte: new Date(String(fechaFin)) }
                        },
                      },
                    }
                  : {}),
              },
              select: {
                idHabitacion: true,
                capacidad: true,
                precio: true,
              },
            },
          },
        });
    
        if (hospedajes.length === 0) {
          return res.status(404).json({ message: "No hay hospedajes disponibles." });
        }
    
        const result = hospedajes.map((h) => {
          const capacidades = h.habitaciones.map((hab) => hab.capacidad);
          const precios = h.habitaciones.map((hab) => hab.precio);
          return {
            ...h,
            capacidad: Math.max(...capacidades),
            PrecioMinimo: Math.min(...precios),
          };
        });
    
        return res.status(200).json(result);
    }catch(error){
        console.log(error);
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }

}

export async function getHospedaje(req: Request, res: Response) {
    try{
      const hospedaje = await prisma.hospedaje.findUnique({
        where: { idHospedaje: String(req.params.id) }
      });
  
      if (!hospedaje) {
        handleHttpError(res, "No se encuentra el hospedaje", 404)
        return;
      }
          
      res.status(200).json(hospedaje);
    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}

export async function getHospedajesDestacados(req: Request, res: Response) {
    try{
      const hospedajes = await prisma.hospedaje.findMany({
        where: { destacado: true }
      });
  
      if (hospedajes.length === 0) return handleHttpError(res, "No hay hospedajes destacados", 404)

      return res.status(200).json(hospedajes);
    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}