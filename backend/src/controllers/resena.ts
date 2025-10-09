import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function crearResena(req: Request, res: Response) {
  try {
    const dataResena = matchedData(req);

    const nuevaResena = await prisma.resena.create({
        data: {
            idHospedaje: dataResena.idHospedaje,
            idUsuario: dataResena.idUsuario,
            idHabitacion: dataResena.idHabitacion,
            calificacion: dataResena.calificacion,
            comentario: dataResena.comentario
        }
    })

    return res.status(201).json(nuevaResena);
  } catch(error){
    handleHttpError(res, "Error al crear resena", 500);
    return;
  }
}

export async function actualizarResena(req: Request, res: Response) {
  try {
    const dataResena = matchedData(req);

    const resenaActualizada = await prisma.resena.update({
        where:{ 
            idResena: String(dataResena.idResena)
        },
        data: {
            calificacion: dataResena.calificacion,
            comentario: dataResena.comentario
        }
    })

    if(!resenaActualizada) return handleHttpError(res, "No se encontró la reseña", 404);

    return res.status(200).json(resenaActualizada);
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}

export async function getResenasUsuario(req: Request, res: Response) {
  try {
    const { idUsuario, idHospedaje, idHabitacion } = req.params;

    const resenaUsuario = await prisma.resena.findFirst({
        where:{
            idUsuario: String(idUsuario),
            idHospedaje: String(idHospedaje),
            idHabitacion: String(idHabitacion), 
        }
    })

    if(!resenaUsuario) return handleHttpError(res, "No se encontraron reseñas", 404);
    
    res.status(200).json(resenaUsuario);
  } catch(error){
    handleHttpError(res, "Error al obtener reseña", 500);
    return;
  }
}

export async function getMejoresResenas(req: Request, res: Response) {
  try {
    const cantidad = parseInt(req.query.cantidad as string) || 10;

    const resenas = await prisma.resena.findMany({

      where: {
        calificacion: {
          in: [4, 5],
        },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
      take: cantidad,
      orderBy: {
        updated_at: 'asc',
      },
    });

    if(!resenas) return handleHttpError(res, "No se encontraron reseñas de 5 o 4 estrellas", 404);

    const shuffled = resenas.sort(() => Math.random() - 0.5).slice(0, cantidad);

    const topResenas = shuffled.map((r) => ({
      idHospedaje: r.idHospedaje,
      calificacion: r.calificacion,
      comentario: r.comentario,
      usuario: r.usuario.nombre,
    }));

    res.json(topResenas);
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}

export async function eliminarResena(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    await prisma.resena.delete({
      where: { idResena: String(id) }
    });

    res.status(200).json({ success: true, message: 'Reseña eliminada exitosamente' });
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}