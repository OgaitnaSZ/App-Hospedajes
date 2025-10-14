import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getHabitaciones(req: Request, res: Response) {
    try{
        const { idHospedaje, desde, hasta, capacidad } = req.query;

        const hospedajeExistente = await prisma.hospedaje.findUnique({
            where: { idHospedaje: String(idHospedaje) }
        });
        
        if (!hospedajeExistente) return handleHttpError(res, "ID de hospedaje no encontrado", 404);

        const habitaciones = await prisma.habitaciones.findMany({
          where: {
            idHospedaje: String(idHospedaje),
            ...(capacidad
              ? {
                  capacidad: {
                    gte: Number(capacidad),
                  },
                }
              : {}),
            ...(desde && hasta
              ? {
                  reservas_hospedajes: {
                    none: {
                      // Ninguna reserva que se superponga
                      fechaInicio: {
                        lt: new Date(hasta as string),
                      },
                      fechaFin: {
                        gt: new Date(desde as string),
                      },
                    },
                  },
                }
              : {}),
          }
        });

        if(habitaciones.length > 0){
          return res.status(200).json(habitaciones);
        }else{
          return res.status(404).send("No se encontraron habitaciones disponibles con los filtros seleccionados.")
        }
    }catch(error){
        console.log(error);
        handleHttpError(res, "Error al obtener habitaciones", 500);
        return;
    }
}