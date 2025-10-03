import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';
import crypto from "crypto";
import nodemailer from "nodemailer";
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
  try{
    const dataPassword = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { IdUsuario: dataPassword.idUsuario }
    });
    
    if(!existingUser){
        handleHttpError(res, "USUARIO NO EXISTE", 404)
        return
    }

    const hashPassword = existingUser.Password;
    const check = await compare(dataPassword.password, hashPassword);
    if(!check){
        handleHttpError(res, "PASSWORD INVALIDO", 400)
        return
    }

    const hashedNewPassword = await encrypt(dataPassword.newPassword);

    const updatedUser = await prisma.usuario.update({
      where: {IdUsuario: Number(dataPassword.idUsuario)},
      data: { Password: hashedNewPassword }
    });

    const { Password, ...userWithoutPassword } = updatedUser; // Eliminar password para la respuesta

    res.status(200).send({updatedUser: userWithoutPassword});
  }catch(error){
    handleHttpError(res, "Error al actualizar password", 500)
  }
}

async function recoverPassword(req: Request, res: Response): Promise<void> {
  try{
    const emailUser = matchedData(req);

    const existingUser = await prisma.usuario.findUnique({
      where: { Email: emailUser.email }
    });

    if (!existingUser) {
      res.status(200).send({ message: "Correo de recuperación enviado" }); // Para mas seguridad
      return;
    }

    // Eliminar tokens viejos de la DB
    await prisma.password_resets.deleteMany({
      where: { Email: emailUser.email }
    });

    // Generar nuevo token que expira en una hora
    const token = crypto.randomBytes(16).toString("hex"); 
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token en la db
    const reset = await prisma.password_resets.create({
      data: {
        Email: emailUser.email,
        Token: token,
        Expiry: expiry,
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
  }
}

async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const data = matchedData(req);

    // Buscar token
    const resetEntry = await prisma.password_resets.findUnique({
      where: { Token: data.token },
    });

    if (!resetEntry || resetEntry.Expiry < new Date()) {
      handleHttpError(res, "Token inválido o expirado", 400)
      return;
    }

    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { Email: resetEntry.Email },
    });

    if (!user) {
      handleHttpError(res, "Usuario no encontrado", 400)
      return;
    }

    // Hashear contraseña nueva
    const hashedPassword = await encrypt(data.password);

    // Actualizar usuario
    await prisma.usuario.update({
      where: { Email: resetEntry.Email },
      data: { Password: hashedPassword },
    });

    // Eliminar token usado
    await prisma.password_resets.delete({
      where: { Token: data.token },
    });

    res.status(200).send({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    handleHttpError(res, "Error al intentar restablecer el password", 500)
  }
}

export { login, register, updatePassword, recoverPassword, resetPassword }
