import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import { matchedData } from 'express-validator';
import { compare, encrypt } from "../utils/handlePassword";
import { tokenSign } from "../utils/handlerJwt";
import { handleHttpError } from "../utils/handleError";

const prisma = new PrismaClient()

async function login(req: Request, res: Response): Promise<void> {
  try {
    const dataLogin = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { Email: dataLogin.email }
    });
    
    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }
    
    const hashPassword = existingUser.Password;
    const check = await compare(dataLogin.password, hashPassword);
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
    const dataRegister = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { Email: dataRegister.email }
    });

    if (existingUser) {
      handleHttpError(res, "El email ya está registrado", 400)
      return;
    }

    const hashedPassword = await encrypt(dataRegister.password);

    const dataUser = await prisma.usuario.create({ 
      data: { 
        Nombre: dataRegister.nombre,
        Apellido: dataRegister.apellido, 
        Email: dataRegister.email,
        Telefono: dataRegister.telefono,
        Password: hashedPassword,
        Rol: 'huesped' 
      } 
    });

    const token = await tokenSign(dataUser);
    const { Password, ...userWithoutPassword } = dataUser; // Eliminar password para la respuesta

    const data = {
      token,
      user: userWithoutPassword
    };
    res.status(201)
    res.send({ data });
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
