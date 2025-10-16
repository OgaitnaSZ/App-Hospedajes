import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function crearResena(req: Request, res: Response) {
  try {
    const dataResena = matchedData(req);

    if (req.user.idUsuario !== dataResena.idUsuario) {
      handleHttpError(res, "No tienes permiso para crear esta resena", 401);
      return
    }

    const nuevaResena = await prisma.resena.create({
        data: {
            idHospedaje: dataResena.idHospedaje,
            idUsuario: dataResena.idUsuario,
            idHabitacion: dataResena.idHabitacion,
            calificacion: dataResena.calificacion,
            comentario: dataResena.comentario
        },
        select: {
            idResena: true,
            idHospedaje: true,
            idUsuario: true,
            idHabitacion: true,
            calificacion: true,
            comentario: true
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

    if (req.user.idUsuario !== dataResena.idUsuario) {
      handleHttpError(res, "No tienes permiso para crear esta resena", 401);
      return
    }

    const resenaExostemte = await prisma.resena.findUnique({
      where: { idResena: String(dataResena.idResena) }
    });
    
    if (!resenaExostemte) {
      return handleHttpError(res, "ID de reseña no encontrada", 404)
    }

    const resenaActualizada = await prisma.resena.update({
        where:{ 
            idResena: String(dataResena.idResena)
        },
        data: {
            calificacion: dataResena.calificacion,
            comentario: dataResena.comentario
        }
    })

    return res.status(200).json(resenaActualizada);
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}

export async function getResenasUsuario(req: Request, res: Response) {
  try {
    const { idUsuario, idHospedaje, idHabitacion } = req.params;

    if (req.user.idUsuario !== idUsuario) {
      handleHttpError(res, "No tienes permiso para ver esta resena", 401);
      return
    }

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

export async function getResenasHospedaje(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    const hospedajeExistente = await prisma.hospedaje.findUnique({
      where: { idHospedaje: String(id) }
    });
    
    if (!hospedajeExistente) {
      return handleHttpError(res, "ID de hospedaje no encontrado", 404)
    }

    const resenasHospedaje = await prisma.resena.findMany({
        where:{
            idHospedaje: String(id),
        }
    })

    if(resenasHospedaje.length === 0) return handleHttpError(res, "No se encontraron reseñas", 404);
    
    res.status(200).json(resenasHospedaje);
  } catch(error){
    handleHttpError(res, "Error al obtener reseña", 500);
    return;
  }
}

export async function getMejoresResenas(req: Request, res: Response) {
  try {
    const cantidad = parseInt(req.query.cantidad as string) || 5;

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

    if(resenas.length === 0) return handleHttpError(res, "No se encontraron reseñas de 5 o 4 estrellas", 404);

    const shuffled = resenas.sort(() => Math.random() - 0.5).slice(0, cantidad);

    const topResenas = shuffled.map((r) => ({
      idHospedaje: r.idHospedaje,
      calificacion: r.calificacion,
      comentario: r.comentario,
      usuario: r.usuario.nombre,
    }));

    res.status(200).json(topResenas);
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}

export async function eliminarResena(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    const resenaExistente = await prisma.resena.findUnique({
      where: { idResena: String(id) }
    });
    
    if (!resenaExistente) {
      return handleHttpError(res, "ID de resena no encontrado", 404)
    }

    if (req.user.idUsuario !== resenaExistente.idUsuario) {
      handleHttpError(res, "No tienes permiso para eliminar esta resena", 401);
      return
    }

    await prisma.resena.delete({
      where: { idResena: String(id) }
    });

    res.status(200).json({ success: true, message: 'Reseña eliminada exitosamente' });
  } catch(error){
    handleHttpError(res, "Error al obtener servicios", 500);
    return;
  }
}