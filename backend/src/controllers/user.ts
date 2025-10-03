import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

// Devolver datos del usuario
export async function getData(req: Request, res: Response) {
  try {
    const idUsuario = req.query.idUsuario;

    if (!idUsuario || isNaN(Number(idUsuario))) {
        handleHttpError(res, "ID de usuario no válido", 400);
        return;
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { IdUsuario: Number(idUsuario) },
      select: {
        Nombre: true,
        Apellido: true,
        Email: true,
        Telefono: true
      },
    });

    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }

    res.status(200).json(existingUser);
  } catch(error){
    handleHttpError(res, "Error al obtener datos del usuario", 500);
    return;
  }
}

// Actualizar perfil de usuario
export async function updateData(req: Request, res: Response) {
  try {
    const dataUser = matchedData(req);

    const updatedUser = await prisma.usuario.update({
      where: { IdUsuario: Number(dataUser.idUsuario) },
      data: { 
        Nombre: dataUser.nombre,
        Apellido: dataUser.apellido,
        Email: dataUser.email,
        Telefono: dataUser.telefono
      },
      select: {
        Nombre: true,
        Apellido: true,
        Email: true,
        Telefono: true
      }
    });

    if(!updatedUser){
      handleHttpError(res, "ID de usuario incorrecto", 404)
      return
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    handleHttpError(res, "No se pudo actualizar el usuario", 500)
    return;
  }
}

// Guardar suscripción de email
export async function subscribeEmail(req: Request, res: Response) {
  try{
    const dataUser = matchedData(req);

    const existingUser = await prisma.suscripcionesNewsletter.findUnique({
      where: { Email: dataUser.email }
    });

    if (existingUser) {
      handleHttpError(res, "El email ya está suscrito", 400)
      return;
    }

    const subscribed = await prisma.suscripcionesNewsletter.create({
      data: {
        Email: dataUser.email,
      },
    });

    res.status(201).json({" message": "Suscripto correctamente.", "email": subscribed });
  }catch(error){
    console.log(error);
    handleHttpError(res, "No se pudo suscribir al email", 500);
    return;
  }
}
