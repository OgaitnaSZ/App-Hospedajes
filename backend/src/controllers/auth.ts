import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { matchedData } from 'express-validator';
import { compare, encrypt } from "../utils/handlePassword";
import { tokenSign } from "../utils/handlerJwt";
import { handleHttpError } from "../utils/handleError";


const prisma = new PrismaClient()

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const dataLogin = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { email: dataLogin.email }
    });
    
    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }
    
    const hashPassword = existingUser.password;
    const check = await compare(dataLogin.password, hashPassword);
    if(!check){
        handleHttpError(res, "PASSWORD INVALIDO", 400)
        return
    }

    const token = await tokenSign(existingUser);
    const { password, ...userWithoutPassword } = existingUser; // Eliminar password para la respuesta
    
    const data = {
      token,
      user: userWithoutPassword
    }
        
    res.status(200).send({data});
  } catch (error) {
      res.status(500)
      handleHttpError(res, "ERROR_LOGIN_USER")
      return;
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const dataRegister = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { email: dataRegister.email }
    });

    if (existingUser) {
      handleHttpError(res, "El email ya está registrado", 400)
      return;
    }

    const hashedPassword = await encrypt(dataRegister.password);

    const dataUser = await prisma.usuario.create({ 
      data: { 
        nombre: dataRegister.nombre,
        apellido: dataRegister.apellido, 
        email: dataRegister.email,
        telefono: dataRegister.telefono,
        password: hashedPassword,
        rol: 'huesped' 
      } 
    });

    const token = await tokenSign(dataUser);
    const { password, ...userWithoutPassword } = dataUser; // Eliminar password para la respuesta

    const data = {
      token,
      user: userWithoutPassword
    };
    res.status(201)
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "Error al registrar el usuario", 500)
    return;
  }
}


export async function updatePassword(req: Request, res: Response): Promise<void> {
  try{
    const dataPassword = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { idUsuario: dataPassword.idUsuario }
    });
    
    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }

    const hashPassword = existingUser.password;
    const check = await compare(dataPassword.password, hashPassword);
    if(!check){
        handleHttpError(res, "PASSWORD INVALIDO", 400)
        return
    }

    const hashedNewPassword = await encrypt(dataPassword.newPassword);

    const updatedUser = await prisma.usuario.update({
      where: {idUsuario: dataPassword.idUsuario},
      data: { password: hashedNewPassword }
    });

    const { password, ...userWithoutPassword } = updatedUser; // Eliminar password para la respuesta

    res.status(200).send({updatedUser: userWithoutPassword});
  }catch(error){
    handleHttpError(res, "Error al actualizar password", 500)
    return;
  }
}

export async function recoverPassword(req: Request, res: Response): Promise<void> {
  try{
    const emailUser = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { email: emailUser.email }
    });

    if (!existingUser) {
      res.status(200).send({ message: "Correo de recuperación enviado" }); // Para mas seguridad
      return;
    }

    // Eliminar tokens viejos de la DB
    await prisma.password_resets.deleteMany({
      where: { email: emailUser.email }
    });

    // Generar nuevo token que expira en una hora
    const token = crypto.randomBytes(16).toString("hex"); 
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token en la db
    const reset = await prisma.password_resets.create({
      data: {
        email: emailUser.email,
        token: token,
        expiry: expiry,
      },
    });

    // transporter con SMTP de tu proveedor
    const transporter = nodemailer.createTransport({
      host: "smtp.tu-proveedor.com",
      port: 587,
      secure: false, // true si usas 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.PUBLIC_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Soporte" <no-reply@tu-dominio.com>',
      to: emailUser.email,
      subject: "Recuperación de contraseña",
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      html: `<p>Haz clic en el enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).send({ message: "Correo de recuperación enviado" });

  }catch(error){
    handleHttpError(res, "Error al intentar recuperar el password", 500)
    return;
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const data = matchedData(req);

    // Buscar token
    const resetEntry = await prisma.password_resets.findUnique({
      where: { token: data.token },
    });

    if (!resetEntry || resetEntry.expiry < new Date()) {
      handleHttpError(res, "Token inválido o expirado", 400)
      return;
    }

    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email: resetEntry.email },
    });

    if (!user) {
      handleHttpError(res, "Usuario no encontrado", 400)
      return;
    }

    // Hashear contraseña nueva
    const hashedPassword = await encrypt(data.password);

    // Actualizar usuario
    await prisma.usuario.update({
      where: { email: resetEntry.email },
      data: { password: hashedPassword },
    });

    // Eliminar token usado
    await prisma.password_resets.delete({
      where: { token: data.token },
    });

    res.status(200).send({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    handleHttpError(res, "Error al intentar restablecer el password", 500)
    return;
  }
}