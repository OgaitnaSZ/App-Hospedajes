import { Request, Response } from "express";

async function updateData(req: Request, res: Response) {
  // actualizar perfil
}

async function getData(req: Request, res: Response) {
  // devolver datos del usuario
}

async function subscribeEmail(req: Request, res: Response) {
  // guardar suscripción de email
}

export { updateData, getData, subscribeEmail }