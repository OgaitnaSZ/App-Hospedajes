import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { PrismaClient, habitaciones_tipo } from '../generated/prisma';
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError";
const prisma = new PrismaClient()

// Hospedajes
export async function agregarHospedaje(req: Request, res: Response) {
  try {
    const dataHospedaje = matchedData(req);

    const nuevoHospedaje = await prisma.hospedaje.create({ 
      data: { 
        titulo: String(dataHospedaje.titulo),
        descripcion: String(dataHospedaje.descripcion), 
        servicios: String(dataHospedaje.servicios),
        estrellas: Number(dataHospedaje.estrellas),
        telefono: String(dataHospedaje.telefono),
        ciudad: String(dataHospedaje.ciudad),
        direccion: String(dataHospedaje.direccion),
        coordenadas: String(dataHospedaje.coordenadas),
        imagen: String(dataHospedaje.imagen),
        destacado: false
      } 
    });
        
    return res.status(201).json(nuevoHospedaje);
  } catch(error){
        handleHttpError(res, "Error al crear hospedaje", 500);
        return;
  }
}

export async function modificarHospedaje(req: Request, res: Response) {
  try {
    const dataHospedaje = matchedData(req);

    const updatedHospedaje = await prisma.hospedaje.update({
      where: { idHospedaje: String(dataHospedaje.idHospedaje) },
      data: { 
        titulo: String(dataHospedaje.titulo),
        descripcion: String(dataHospedaje.descripcion), 
        servicios: String(dataHospedaje.servicios),
        estrellas: Number(dataHospedaje.estrellas),
        telefono: String(dataHospedaje.telefono),
        ciudad: String(dataHospedaje.ciudad),
        direccion: String(dataHospedaje.direccion),
        coordenadas: String(dataHospedaje.coordenadas),
        imagen: String(dataHospedaje.imagen),
        destacado: false
      } 
    });

    if(!updatedHospedaje){
      handleHttpError(res, "ID de hospedaje incorrecto", 404)
      return
    }

    res.status(200).json(updatedHospedaje);
  } catch(error){
    handleHttpError(res, "Error al obtener datos del hospedaje", 500);
    return;
  }
}

export async function eliminarHospedaje(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;
    console.log(data.id);

    const hospedaje = await prisma.hospedaje.findUnique({
        where: { idHospedaje: String(id)}
    });

    if (!hospedaje) {
      handleHttpError(res, "No se encuentra el hospedaje", 400)
      return;
    }

    // Eliminar imagenes del servidor
    await eliminarImagenesPorHospedaje(String(id), res);

    // Eliminar las habitaciones asociadas al IdHospedaje
    await prisma.habitaciones.deleteMany({
      where: { idHospedaje: id }
    });

    // Eliminar el hospedaje
    await prisma.hospedaje.delete({
      where: { idHospedaje: String(id) }
    });

    res.json({ success: true, message: 'Hospedaje eliminado exitosamente' });

  } catch(error){
    console.log(error);
    handleHttpError(res, "Error al intentar eliminar el hospedaje", 500);
    return;
  }
}

// Habitaciones
export async function getHabitaciones(req: Request, res: Response) {
  try {
    const data = req.params;
    const IdHospedaje = <string>data.id;

    const habitaciones = await prisma.habitaciones.findMany({
        where: { idHospedaje: IdHospedaje }
    })

    if(habitaciones.length > 0){
      res.status(200).json(habitaciones);
    }else{
      return res.status(200).send("No se encontraron habitaciones para este hospedaje.")
    }
  } catch(error){
    handleHttpError(res, "Error al obtener habitaciones", 500);
    return;
  }
}

export async function agregarHabitacion(req: Request, res: Response) {
  try {
    const dataHabitacion = matchedData(req);

    const nuevaHabitacion = await prisma.habitaciones.create({ 
      data: { 
        idHospedaje: String(dataHabitacion.IdHospedaje),
        numero: String(dataHabitacion.Numero), 
        tipo: dataHabitacion.Tipo as habitaciones_tipo,
        precio: Number(dataHabitacion.Precio),
        capacidad: Number(dataHabitacion.Capacidad),
        servicios: String(dataHabitacion.Servicios)
      } 
    });
        
    return res.status(201).json(nuevaHabitacion);
  } catch(error){
    handleHttpError(res, "Error al agregar habitacion", 500);
    return;
  }
}

export async function modificarHabitacion(req: Request, res: Response) {
  try {
    const dataHabitacion = matchedData(req);

    const updatedHabitacion = await prisma.habitaciones.update({
      where: { idHabitacion: String(dataHabitacion.IdHabitacion) },
      data: { 
        idHospedaje: String(dataHabitacion.IdHospedaje),
        numero: String(dataHabitacion.Numero), 
        tipo: dataHabitacion.tipo as habitaciones_tipo,
        precio: Number(dataHabitacion.Precio),
        capacidad: Number(dataHabitacion.Capacidad),
        servicios: String(dataHabitacion.Servicios)
      } 
    });

    if(!updatedHabitacion){
      handleHttpError(res, "ID de habitacion incorrecto", 404)
      return
    }
    res.status(200).json(updatedHabitacion);
  } catch(error){
    console.log(error);
    handleHttpError(res, "Error al modificar la habitacion", 500);
    return;
  }
}

export async function eliminarHabitacion(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    const habitacion = await prisma.habitaciones.findUnique({
        where: { idHabitacion: String(id)}
    });

    if (!habitacion) {
      handleHttpError(res, "No se encuentra la habitacion", 400)
      return;
    }

    // Eliminar habitacion
    await prisma.habitaciones.delete({
      where: { idHabitacion: String(id) }
    });

    res.json({ success: true, message: 'Habitacion eliminada exitosamente' });
  } catch(error){
    handleHttpError(res, "Error al intentar eliminar la habitacion", 500);
    return;
  }
}

/*--- Funciones Extras ---*/
const eliminarImagenesPorHospedaje = async (id: string, res: Response) => {
  try {
    // Obtener los path de las imágenes asociadas al IdHospedaje
    const imagenes = await prisma.fotos.findMany({
        where: { idHospedaje: String(id) },
        select:{
          path: true
        }
    });

    for (const imagen of imagenes) {
      const nombreArchivoFisico = `${imagen.path}`;
      const ruta = path.join(__dirname, '../uploads', nombreArchivoFisico);

      try {
        // Verificar y eliminar archivo físico
        await fs.promises.unlink(ruta);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          //console.warn(`Archivo no encontrado en disco: ${ruta}`);
        } else {
          //console.error(`Error al eliminar archivo físico: ${ruta}`, err);
        }
        // Seguir eliminando los demás aunque uno falle
      }
    }

    // Eliminar las fotos de la base de datos
    await prisma.fotos.deleteMany({
      where: { idHospedaje: id }
    });
    
  } catch (error) {
    throw handleHttpError(res, "Error al eliminar archivos de Consulta: error", 500);
  }
};