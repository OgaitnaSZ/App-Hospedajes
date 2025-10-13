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
    
    const hospedajeExistente = await prisma.hospedaje.findUnique({
      where: { idHospedaje: String(dataHospedaje.idHospedaje) }
    });
    
    if (!hospedajeExistente) {
      return handleHttpError(res, "ID de hospedaje no encontrado", 404)
    }

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

    const hospedaje = await prisma.hospedaje.findUnique({
        where: { idHospedaje: String(id)}
    });

    if (!hospedaje) {
      handleHttpError(res, "No se encuentra el hospedaje", 404)
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

    res.status(200).json({ success: true, message: 'Hospedaje eliminado exitosamente' });

  } catch(error){
    handleHttpError(res, "Error al intentar eliminar el hospedaje", 500);
    return;
  }
}

// Habitaciones
export async function getHabitaciones(req: Request, res: Response) {
  try {
    const data = req.params;
    const IdHospedaje = <string>data.id;

    const habitacionExistente = await prisma.hospedaje.findUnique({
      where: { idHospedaje: String(IdHospedaje) }
    });
    
    if (!habitacionExistente) {
      return handleHttpError(res, "ID de hospedaje no encontrado", 404)
    }

    const habitaciones = await prisma.habitaciones.findMany({
        where: { idHospedaje: IdHospedaje }
    })

    if(habitaciones.length > 0){
      res.status(200).json(habitaciones);
    }else{
      return res.status(404).send("No se encontraron habitaciones para este hospedaje.")
    }
  } catch(error){
    handleHttpError(res, "Error al obtener habitaciones", 500);
    return;
  }
}

export async function agregarHabitacion(req: Request, res: Response) {
  try {
    const dataHabitacion = matchedData(req);

    const hospedajeExistente = await prisma.hospedaje.findUnique({
      where: { idHospedaje: String(dataHabitacion.idHospedaje) }
    });
    
    if (!hospedajeExistente) {
      return handleHttpError(res, "ID de hospedaje no encontrado", 404)
    }

    const nuevaHabitacion = await prisma.habitaciones.create({ 
      data: { 
        idHospedaje: String(dataHabitacion.idHospedaje),
        numero: String(dataHabitacion.numero), 
        tipo: dataHabitacion.tipo as habitaciones_tipo,
        precio: Number(dataHabitacion.precio),
        capacidad: Number(dataHabitacion.capacidad),
        servicios: String(dataHabitacion.servicios)
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

    const habitacionExistente = await prisma.habitaciones.findUnique({
      where: { idHabitacion: String(dataHabitacion.idHabitacion) }
    });
    
    if (!habitacionExistente) {
      return handleHttpError(res, "ID de habitacion no encontrado", 404)
    }

    const updatedHabitacion = await prisma.habitaciones.update({
      where: { idHabitacion: String(dataHabitacion.idHabitacion) },
      data: { 
        idHospedaje: String(dataHabitacion.idHospedaje),
        numero: String(dataHabitacion.numero), 
        tipo: dataHabitacion.tipo as habitaciones_tipo,
        precio: Number(dataHabitacion.precio),
        capacidad: Number(dataHabitacion.capacidad),
        servicios: String(dataHabitacion.servicios)
      } 
    });

    res.status(200).json(updatedHabitacion);
  } catch(error){
    handleHttpError(res, "Error al modificar la habitacion", 500);
    return;
  }
}

export async function eliminarHabitacion(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    const habitacionExistente = await prisma.habitaciones.findUnique({
      where: { idHabitacion: String(id) }
    });
    
    if (!habitacionExistente) {
      return handleHttpError(res, "ID de habitacion no encontrado", 404)
    }

    // Eliminar habitacion
    await prisma.habitaciones.delete({
      where: { idHabitacion: String(id) }
    });

    res.status(200).json({ success: true, message: 'Habitacion eliminada exitosamente' });
  } catch(error){
    handleHttpError(res, "Error al intentar eliminar la habitacion", 500);
    return;
  }
}

// Actividades
export async function getActividades(req: Request, res: Response) {
  try {
    const actividades = await prisma.actividades.findMany();

    if(actividades.length > 0){
      res.status(200).json(actividades);
    }else{
      return res.status(404).send("No se encontraron actividades.")
    }
  } catch(error){
    handleHttpError(res, "Error al intentar obtener actividades", 500);
    return;
  }
}

export async function agregarActividad(req: Request, res: Response) {
  try {
    const dataActividad = matchedData(req);

    const nuevaActividad = await prisma.actividades.create({ 
      data: { 
        nombre: String(dataActividad.nombre),
        descripcion: String(dataActividad.descripcion), 
        imagen: String(dataActividad.imagen),
        ciudad: String(dataActividad.ciudad),
        precio: dataActividad.precio
      } 
    });
        
    return res.status(201).json(nuevaActividad);
  } catch(error){
    handleHttpError(res, "Error al agregar actividad", 500);
    return;
  }
}

export async function modificarActividad(req: Request, res: Response) {
  try {
    const dataActividad = matchedData(req);

    const actividadExistente = await prisma.actividades.findUnique({
      where: { idActividad: String(dataActividad.idActividad) }
    });
    
    if (!actividadExistente) {
      return handleHttpError(res, "ID de actividad no encontrado", 404)
    }

    const updatedActividad = await prisma.actividades.update({
      where: { idActividad: String(dataActividad.idActividad) },
      data: { 
        idActividad:dataActividad.idActividad,
        nombre: String(dataActividad.nombre),
        descripcion: String(dataActividad.descripcion), 
        imagen: String(dataActividad.imagen),
        ciudad: String(dataActividad.ciudad),
        precio: dataActividad.precio
      } 
    });

    res.status(200).json(updatedActividad);
  } catch(error){
    handleHttpError(res, "Error al intentar eliminar la habitacion", 500);
    return;
  }
}

export async function eliminarActividad(req: Request, res: Response) {
  try {
    const data = req.params;
    const id = <string>data.id;

    await prisma.actividades.delete({
      where: { idActividad: String(id) }
    });
    res.status(200).json({ success: true, message: 'Actividad eliminada exitosamente' });
  } catch(error){
    handleHttpError(res, "Error al intentar eliminar la actividad", 500);
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