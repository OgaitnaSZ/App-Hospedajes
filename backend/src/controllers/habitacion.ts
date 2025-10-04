import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function getHabitaciones(req: Request, res: Response) {
    try{
        const { IdHospedaje, Desde, Hasta, Capacidad } = req.query;

        const habitaciones = await prisma.habitaciones.findMany({
          where: {
            idHospedaje: String(IdHospedaje),
            ...(Capacidad
              ? {
                  capacidad: {
                    gte: Number(Capacidad),
                  },
                }
              : {}),
            ...(Desde && Hasta
              ? {
                  reservas: {
                    none: {
                      // Ninguna reserva que se superponga
                      fechaInicio: {
                        lt: new Date(Hasta as string),
                      },
                      fechaFin: {
                        gt: new Date(Desde as string),
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
          return res.status(200).send("No se encontraron habitaciones disponibles con los filtros seleccionados.")
        }
    }catch(error){
        console.log(error);
        handleHttpError(res, "Error al obtener habitaciones", 500);
        return;
    }
}