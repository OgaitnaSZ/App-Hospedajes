import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()

// Actualizar perfil de usuario
export async function updateData(req: Request, res: Response) {
  const { IdUsuario, Nombre, Email } = req.body;
  try {
    const updatedUser = await prisma.usuario.update({
      where: { IdUsuario: Number(IdUsuario) },
      data: { Nombre, Email },
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "No se pudo actualizar" });
  }
}

// Devolver datos del usuario
export async function getData(req: Request, res: Response) {
  const { IdUsuario } = req.params;
  try {
    const user = await prisma.usuario.findUnique({
      where: { IdUsuario: Number(IdUsuario) },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Error al obtener datos" });
  }
}

// Guardar suscripción de email
export async function subscribeEmail(req: Request, res: Response) {

}
