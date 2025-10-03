import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { compare, encrypt } from "../utils/handlePassword";
import { tokenSign } from "../utils/handlerJwt";
import { handleHttpError } from "../utils/handleError";

const prisma = new PrismaClient()

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.usuario.findUnique({
      where: { Email: email }
    });
    
    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }
    
    const hashPassword = existingUser.Password;
    const check = await compare(password, hashPassword);
    if(!check){
        handleHttpError(res, "PASSWORD INVALIDO", 400)
        return
    }

    const token = await tokenSign(existingUser);
    const { Password, ...userWithoutPassword } = existingUser; // Eliminar password para la respuesta
    
    const data = {
      token,
      user: userWithoutPassword
    }
        
    res.status(200).send({data});
  } catch (error) {
      res.status(500)
      handleHttpError(res, "ERROR_LOGIN_USER")
  }
}

async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;
    const existingUser = await prisma.usuario.findUnique({
      where: { Email: email }
    });

    if (existingUser) {
      handleHttpError(res, "El email ya está registrado", 400)
      return;
    }

    const hashedPassword = await encrypt(password);

    await prisma.usuario.create({ 
      data: { 
        Nombre: nombre,
        Apellido: apellido, 
        Email: email,
        Telefono: telefono,
        Password: hashedPassword,
        Rol: 'huesped' 
      } 
    });

    res.status(201).json("Usuario creado con éxito");
  } catch (error) {
    handleHttpError(res, "Error al registrar el usuario", 500)
  }
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
