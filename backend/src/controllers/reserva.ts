import { Request, Response } from "express";
import { pago_estado, pago_tipoReserva, PrismaClient } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function reservarHospedaje(req: Request, res: Response) {
  try {
    const dataReserva = matchedData(req);
    const result = await prisma.$transaction(async (tx) => {
        // Crear reserva
        const nuevaReserva = await tx.reservas.create({
            data: {
                idUsuario: String(dataReserva.idUsuario),
                idHospedaje: String(dataReserva.idHospedaje),
                idHabitacion: String(dataReserva.idHabitacion),
                fechaInicio: new Date(dataReserva.fechaInicio),
                fechaFin: new Date(dataReserva.fechaFin),
                personas: Number(dataReserva.personas),
                precioTotal: Number(dataReserva.precioTotal),
                estado: "pendiente"
            }
        });
    
        const nuevoPago = await tx.pago.create({
            data: {
                nombre: dataReserva.nombre,
                apellido: dataReserva.apellido,
                dni: dataReserva.dni,
                direccion: dataReserva.direccion,
                email: dataReserva.email,
                telefono: dataReserva.telefono,
                monto: Number(dataReserva.precioTotal),
                idPreferencia: dataReserva.idPreferencia,
                estado: pago_estado.pendiente,
                tipoReserva: pago_tipoReserva.hospedaje,
                reservas: { connect: { idReserva: nuevaReserva.idReserva } },
                usuario: { connect: { idUsuario: dataReserva.idUsuario } }
            }
        })

      return { nuevaReserva, nuevoPago };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error al reservar", 500);
  }
}

export async function cancelarReserva(req: Request, res: Response) {
    try{

    } catch(error){
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}

export async function obtenerReserva(req: Request, res: Response) {
    try{

    } catch(error){
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}

export async function obtenerReservasUsuario(req: Request, res: Response) {
    try{

    } catch(error){
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}

export async function obtenerFechasOcupadas(req: Request, res: Response) {
    try{

    } catch(error){
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}

export async function reservarActividad(req: Request, res: Response) {
    try{

    } catch(error){
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}