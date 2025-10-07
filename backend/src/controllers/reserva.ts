import { Request, Response } from "express";
import { pagos_actividades_estado, pagos_hospedajes_estado, PrismaClient, reservas_actividades_estado, reservas_hospedajes_estado } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

export async function reservarHospedaje(req: Request, res: Response) {
  try {
    const dataReserva = matchedData(req);
    const result = await prisma.$transaction(async (tx) => {
        // Crear reserva
        const nuevaReserva = await tx.reservas_hospedajes.create({
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
    
        const nuevoPago = await tx.pagos_hospedajes.create({
            data: {
                nombre: dataReserva.nombre,
                apellido: dataReserva.apellido,
                dni: dataReserva.dni,
                direccion: dataReserva.direccion,
                email: dataReserva.email,
                telefono: dataReserva.telefono,
                monto: Number(dataReserva.precioTotal),
                idPreferencia: dataReserva.idPreferencia,
                estado: pagos_hospedajes_estado.pendiente,
                reservas_hospedajes: { connect: { idReserva: nuevaReserva.idReserva } },
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
        const data = matchedData(req);

        let reservaCancelada:any = undefined;

        if (data.tipo == 'hospedaje'){
          reservaCancelada = await prisma.reservas_hospedajes.update({
              where: { idReserva: String(data.id) },
              data: { 
                  estado: reservas_hospedajes_estado.pendiente_de_cancelacion,
              }
          });
        }else{
            reservaCancelada = await prisma.reservas_actividades.update({
              where: { idReserva: String(data.id) },
              data: { 
                  estado: reservas_actividades_estado.pendiente_de_cancelacion,
              }
          });
        }
        
        if(!reservaCancelada){
            handleHttpError(res, "Reserva no encontrada", 404)
            return
        }
    
    
        res.status(200).json(reservaCancelada);

    } catch(error){
        return handleHttpError(res, "Error al solicitar cancelacion", 500);
    }
}

export async function obtenerReserva(req: Request, res: Response) {
    try{
        const data = matchedData(req);

        let reserva:any = undefined;

        if (data.tipo == 'hospedaje'){
          reserva = await prisma.reservas_hospedajes.findUnique({
              where: { idReserva: String(data.id) }
          });
        }else{
          reserva = await prisma.reservas_actividades.findUnique({
              where: { idReserva: String(data.id) }
          });
        }
    
        if (!reserva) return handleHttpError(res, "No se encuentra la reserva", 400)
            
        res.status(200).json(reserva);
    } catch(error){
        return handleHttpError(res, "Error al obtener reserva", 500);
    }
}

export async function obtenerReservasUsuario(req: Request, res: Response) {
    try{
        const data = matchedData(req);
        let reservasUsuario:any = undefined;

        if (data.tipo == 'hospedaje'){
          reservasUsuario = await prisma.reservas_hospedajes.findMany({
            where: {
              idUsuario: data.id, 
            },
            include: {
              hospedaje: {
                select: {
                  titulo: true,
                  descripcion: true,
                  ciudad: true,
                  imagen: true,
                },
              },
              habitaciones: {
                select: {
                  numero: true,
                  tipo: true,
                  capacidad: true,
                  precio: true,
                },
              },
            },
          });
        }else{
          reservasUsuario = await prisma.reservas_actividades.findMany({
            where: {
              idUsuario: data.id, 
            },
            include: {
              actividades: {
                select: {
                  nombre: true,
                  descripcion: true,
                  ciudad: true,
                  imagen: true,
                  precio: true
                },
              },
            },
          });
        }

        res.status(200).json(reservasUsuario);
    } catch(error){
        return handleHttpError(res, "Error al obtener reservas", 500);
    }
}

export async function obtenerFechasOcupadas(req: Request, res: Response) {
    try{
      const data = matchedData(req);
      let fechasOcupadas:any = undefined;

      if (data.tipo == 'hospedaje'){
        fechasOcupadas = await prisma.reservas_hospedajes.findMany({
          where: {
            idHospedaje: data.id,
          },
          select: {
            fechaInicio: true,
            fechaFin: true,
          },
        });
      }else{
        fechasOcupadas = await prisma.reservas_actividades.findMany({
          where: {
            idActividad: data.id,
          },
          select: {
            fecha: true,
          },
        });
      }
    
      if (!fechasOcupadas || fechasOcupadas.length === 0) {
        res.status(404).json({ error: 'No hay reservas para este hospedaje' });
        return;
      }
    
      res.status(200).json(fechasOcupadas);
    } catch(error){
        return handleHttpError(res, "Error al obtener reservas del hospedaje", 500);
    }
}

export async function reservarActividad(req: Request, res: Response) {
    try{
      const dataReserva = matchedData(req);
      const result = await prisma.$transaction(async (tx) => {
        // Crear reserva
        const nuevaReserva = await tx.reservas_actividades.create({
          data: {
            idUsuario: String(dataReserva.idUsuario),
            idActividad: String(dataReserva.idActividad),
            fecha: new Date(dataReserva.fecha),
            personas: Number(dataReserva.personas),
            precioTotal: Number(dataReserva.precioTotal),
            estado: "pendiente"
          }
        });
    
        const nuevoPago = await tx.pagos_actividades.create({
          data: {
            idUsuario: dataReserva.idUsuario,
            nombre: dataReserva.nombre,
            apellido: dataReserva.apellido,
            dni: dataReserva.dni,
            direccion: dataReserva.direccion,
            email: dataReserva.email,
            telefono: dataReserva.telefono,
            monto: Number(dataReserva.precioTotal),
            idPreferencia: dataReserva.idPreferencia,
            estado: pagos_actividades_estado.pendiente,
            reservas_actividades: { connect: { idReserva: nuevaReserva.idReserva } }
          }
        })
  
        return { nuevaReserva, nuevoPago };
      });
  
      return res.status(201).json(result);

    } catch(error){
      console.log(error);
      return handleHttpError(res, "Error al reservar actividad", 500);
    }
}