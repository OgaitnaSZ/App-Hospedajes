import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { handleHttpError } from "../utils/handleError";
import fs from 'fs';
const prisma = new PrismaClient()

const MEDIA_PATH = `${__dirname}/../uploads`;

export async function subirFotos(req: Request, res: Response) {
    try {
        const { body, files } = req;
        
        if (!files || files.length === 0) return handleHttpError(res, "No se recibieron archivos", 400);

        const hospedajeExistente = await prisma.hospedaje.findUnique({
            where: { idHospedaje: String(body.idHospedaje) }
        });
        
        if (!hospedajeExistente) {
            return handleHttpError(res, "ID de hospedaje no encontrado", 404)
        }
        
        // Mapear todos los archivos subidos
        const archivosData = (files as Express.Multer.File[]).map(file => ({
            idHospedaje: body.idHospedaje,
            path: `${MEDIA_PATH}/uploads/${file.filename}`
        }));
        
        // Guardar en la db
        const data = await prisma.fotos.createMany({
            data: archivosData
        });

        // Obtener las fotos recién creadas
        const fotos = await prisma.fotos.findMany({
            where: {
                idHospedaje: body.idHospedaje
            },
            orderBy: {
                idFoto: 'desc' // o como sea que se ordenen
            },
            take: archivosData.length
        });
        
        return res.status(201).send({ 
          mensaje: `${data.count} fotos fueron agregadas`, 
          data: fotos
        });
    } catch (error) {
        console.log(error);
        return handleHttpError(res, "Error al subir fotos", 500);
    }
}

export async function getFotos(req: Request, res: Response) {
    try{
        const data = req.params;
        const id = <string>data.id;
    
        const fotos = await prisma.fotos.findMany({
            where: {
                idHospedaje: id
            }
        });
    
        if(fotos.length == 0) return handleHttpError(res, "No hay fotos para esta consulta", 404);
    
        res.status(200).json(fotos);
    } catch (error) {
    return handleHttpError(res, "Error al obtener fotos", 500);
    }
}

export async function seleccionarPrincipal(req: Request, res: Response) {
    try{
        const { idHospedaje, idFoto } = req.body;
        
        const hospedajeExistente = await prisma.hospedaje.findUnique({
            where: { idHospedaje: String(idHospedaje) }
        });
        
        if (!hospedajeExistente) {
            return handleHttpError(res, "ID de hospedaje no encontrado", 404)
        }
        
        const fotoExistente = await prisma.fotos.findUnique({
            where: { idFoto: String(idFoto) }
        });
        
        if (!fotoExistente) {
            return handleHttpError(res, "ID de foto no encontrado", 404)
        }
        
        // Actualizar foto principal
        await prisma.hospedaje.update({
          where: { idHospedaje: String(idHospedaje) },
          data: { 
            imagen: String(fotoExistente.path)
          } 
        });
        return res.status(200).send({message: "Foto actualizada"});
    } catch (error) {
        return handleHttpError(res, "Error al eliminar foto", 500);
    }
}

export async function eliminarFoto(req: Request, res: Response) {
    try{
        const params = req.params;
        const id = <string>params.id;
        
        const foto = await prisma.fotos.findUnique({
            where: { idFoto: id }
        });
        
        if (!foto) return handleHttpError(res, "Archivo no encontrado en la base de datos", 404);
        
        const filePath  = foto.path;
        const fileName = filePath.split('/').pop();

        // Verificar si el archivo existe
        if (fs.existsSync(`${MEDIA_PATH}/${fileName}`)) {
            // Eliminar archivo físico
            fs.unlinkSync(`${MEDIA_PATH}/${fileName}`);
        } else {
            //console.log('El archivo físico no existía, pero se procederá a eliminar el registro de la BD');
        }

        await prisma.fotos.delete({
            where: { idFoto: id }
        });

        res.status(200).json({ success: true, message: 'Foto eliminada exitosamente' });
    } catch (error) {
        return handleHttpError(res, "Error al eliminar foto", 500);
    }
}