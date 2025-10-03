import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getHospedajes(req: Request, res: Response) {
    try{
        const { Ciudad, FechaInicio, FechaFin, Capacidad } = req.query;

        /*
            Busca hospedajes que tengan habitaciones con las siguientes condiciones:
                - Hospedaje de la ciudad seleccionada
                - NO reservadas entre las fechas seleccionadas
                - Capacidad mayor o igual a la seleccionada
        */
        const hospedajes = await prisma.hospedaje.findMany({
          where: {
            ...(Ciudad && { Ciudad: String(Ciudad) }),
            habitaciones: {
              some: {
                ...(Capacidad && { Capacidad: { gte: Number(Capacidad) } }),
                ...(FechaInicio && FechaFin
                  ? {
                      reservas: {
                        none: {
                          Estado: "Aprobado",
                          OR: [
                            {
                              FechaInicio: { lte: new Date(String(FechaFin)) },
                              FechaFin: { gte: new Date(String(FechaInicio)) },
                            },
                          ],
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
                ...(Capacidad && { Capacidad: { gte: Number(Capacidad) } }),
                ...(FechaInicio && FechaFin
                  ? {
                      reservas: {
                        none: {
                          Estado: "Aprobado",
                          OR: [
                            {
                              FechaInicio: { lte: new Date(String(FechaFin)) },
                              FechaFin: { gte: new Date(String(FechaInicio)) },
                            },
                          ],
                        },
                      },
                    }
                  : {}),
              },
              select: {
                IdHabitacion: true,
                Capacidad: true,
                Precio: true,
              },
            },
          },
        });

    
        if (!hospedajes.length) {
          return res.status(404).json({ message: "No hay hospedajes disponibles." });
        }
    
        const result = hospedajes.map((h) => {
          const capacidades = h.habitaciones.map((hab) => hab.Capacidad);
          const precios = h.habitaciones.map((hab) => hab.Precio.toNumber());
          return {
            ...h,
            Capacidad: Math.max(...capacidades),
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
    
}

export async function getHospedajesDestacados(req: Request, res: Response) {
    
}

export async function getHospedajesUsuario(req: Request, res: Response) {
    
}