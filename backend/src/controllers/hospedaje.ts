import { Request, Response } from "express";
import { hospedaje_estado, PrismaClient } from '../generated/prisma'
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
            ...(ciudad && { 
              ciudad: String(ciudad), 
              estado: hospedaje_estado.activo 
            }),
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
                          fechaInicio: { lte: new Date(String(fechaFin)) },
                          fechaFin: { gte: new Date(String(fechaInicio)) },
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
            fotos: {
              orderBy: { sort: 'asc' },
              take: 1,
            },
          }
        });
    
        if (hospedajes.length === 0) {
          return res.status(404).json({ message: "No hay hospedajes disponibles." });
        }
    
        const result = await Promise.all(
          hospedajes.map(async (h) => {
            const capacidades = h.habitaciones.map((hab) => hab.capacidad);
            const precios = h.habitaciones.map((hab) => hab.precio);
        
            let serviciosData = [];
            if (typeof h.servicios === 'string') {
              const ids = h.servicios.split(',').map((id) => Number(id));
              serviciosData = await prisma.servicios.findMany({
                where: { idServicio: { in: ids } },
                select: { nombre: true, descripcion: true },
              });
            } else {
              serviciosData = h.servicios || [];
            }
        
            return {
              ...h,
              capacidad: Math.max(...capacidades),
              precioMinimo: Math.min(...precios),
        
              // 👇 Aquí convertimos fotos a string (por ejemplo, solo la primera URL)
              fotos: h.fotos?.[0]?.url ?? null,
        
              servicios: serviciosData,
            };
          })
        );

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
        where: { 
          idHospedaje: String(req.params.id),
          estado: hospedaje_estado.activo
         }
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

export async function getHospedajeDetalle(req: Request, res: Response) {
    try{
      const hospedaje = await prisma.hospedaje.findUnique({
        where: { 
          idHospedaje: String(req.params.id),
          estado: hospedaje_estado.activo
        }
      });
  
      // Obtener hospedaje
      if (!hospedaje) {
        handleHttpError(res, "No se encuentra el hospedaje", 404)
        return;
      }

      // Obtener fotos
      const fotos = await prisma.fotos.findMany({
        where: { idHospedaje: String(req.params.id) },
        select: { url: true }
      });
  
      // Obtener servicios
      const serviciosIds = hospedaje.servicios
        .split(',')
        .map(id => Number(id.trim())); // trim() por si hay espacios
      
      const servicios = await prisma.servicios.findMany({
        where: { 
          idServicio: { in: serviciosIds }
        },
        select: { 
          nombre: true,
          descripcion: true
        }
      });

      // reseñas
      const resenas = await prisma.resena.findMany({
        where: {
          idHospedaje: String(req.params.id)
        }
      })

      const calificacionPromedio = resenas.length > 0
      ? resenas.reduce((acc, r) => acc + (r.calificacion ?? 0), 0) / resenas.length
      : 0;

      const data = {
        ...hospedaje,
        fotos: fotos.map(f => f.url),
        servicios,
        calificacionPromedio,
        resenas
      };
    
      res.status(200).json(data);
    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}

export async function getHospedajesDestacados(req: Request, res: Response) {
    try{
      const hospedajes = await prisma.hospedaje.findMany({
        where: { 
          destacado: true,
          estado: hospedaje_estado.activo
        },
        include: {
          fotos: {
            orderBy: { sort: 'asc' },
            take: 1,
          },
        }
      });

      if (hospedajes.length === 0) return handleHttpError(res, "No hay hospedajes destacados", 404)

      const hospedajesConPrecioMinimo = await Promise.all(
        hospedajes.map(async (hospedaje) => {
          const habitacionMasBarata = await prisma.habitaciones.findFirst({
            where: { idHospedaje: hospedaje.idHospedaje },
            orderBy: { precio: 'asc' },
            select: { precio: true },
          });
      
          return {
            ...hospedaje,
            fotos: hospedaje.fotos?.[0]?.url ?? null,
            precioMinimo: habitacionMasBarata?.precio ?? null,
          };
        })
      );

      return res.status(200).json(hospedajesConPrecioMinimo);
    }catch(error){
        handleHttpError(res, "Error al obtener hospedajes", 500);
        return;
    }
}