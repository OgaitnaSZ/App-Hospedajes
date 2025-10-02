import { Request, Response } from "express";

async function login(req: Request, res: Response): Promise<void> {
  res.send("Login exitoso");
}

async function register(req: Request, res: Response): Promise<void> {
  res.send("Registrado");
}

async function updatePassword(req: Request, res: Response): Promise<void> {
  res.send("Contraseña actualizada");
}

async function recoverPasswordStep1(req: Request, res: Response): Promise<void> {
  res.send("Paso 1 de recuperación");
}

async function recoverPasswordStep2(req: Request, res: Response): Promise<void> {
  res.send("Paso 2 de recuperación");
}

export { login, register, updatePassword, recoverPasswordStep1, recoverPasswordStep2 }
