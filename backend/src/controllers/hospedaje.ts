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
            ...(Ciudad && { ciudad: String(Ciudad) }),
            habitaciones: {
              some: {
                ...(Capacidad && { capacidad: { gte: Number(Capacidad) } }),
                ...(FechaInicio && FechaFin
                  ? {
                      reservas: {
                        none: {
                          estado: "Aprobado",
                          OR: [
                            {
                              fechaInicio: { lte: new Date(String(FechaFin)) },
                              fechaFin: { gte: new Date(String(FechaInicio)) },
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
                ...(Capacidad && { capacidad: { gte: Number(Capacidad) } }),
                ...(FechaInicio && FechaFin
                  ? {
                      reservas: {
                        none: {
                          estado: "Aprobado",
                          OR: [
                            {
                              fechaInicio: { lte: new Date(String(FechaFin)) },
                              fechaFin: { gte: new Date(String(FechaInicio)) },
                            },
                          ],
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
    
        if (!hospedajes.length) {
          return res.status(404).json({ message: "No hay hospedajes disponibles." });
        }
    
        const result = hospedajes.map((h) => {
          const capacidades = h.habitaciones.map((hab) => hab.capacidad);
          const precios = h.habitaciones.map((hab) => hab.precio.toNumber());
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
    try{
      const hospedaje = await prisma.hospedaje.findUnique({
        where: { idHospedaje: String(req.params.id) }
      });
  
      if (!hospedaje) {
        handleHttpError(res, "No se encuentra el hospedaje", 400)
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

    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}

export async function getHospedajesUsuario(req: Request, res: Response) {
    try{

    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}