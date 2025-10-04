import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma'
import { handleHttpError } from "../utils/handleError";
import fs from 'fs';
const prisma = new PrismaClient()

const PUBLIC_URL = process.env.PUBLIC_URL;
const MEDIA_PATH = `${__dirname}/../uploads`;

export async function subirFotos(req: Request, res: Response) {
    try {
        const { body, files } = req;
        
        if (!files || files.length === 0) return handleHttpError(res, "No se recibieron archivos", 400);
        
        // Mapear todos los archivos subidos
        const archivosData = (files as Express.Multer.File[]).map(file => ({
            idHospedaje: body.IdHospedaje,
            path: `${PUBLIC_URL}/uploads/${file.filename}`
        }));
        
        // Guardar en la db
        const data = await prisma.fotos.createMany({
            data: archivosData
        });
        
        return res.status(201).send({ 
          mensaje: `${data.count} fotos fueron agregadas`, 
          data 
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

export async function eliminarFoto(req: Request, res: Response) {
    try{
        const params = req.params;
        const id = <string>params.id;
        
        const foto = await prisma.fotos.findUnique({
            where: { idFoto: id }
        });
        
        if (!foto) return handleHttpError(res, "Archivo no encontrado en la base de datos", 404);
    
        const deleteResponse = await prisma.fotos.delete({
            where: { idFoto: id }
        });
        
        const filePath  = foto.path;

        // Verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            // Eliminar archivo físico
            fs.unlinkSync(filePath);
        } else {
            res.json('El archivo físico no existía, pero se procederá a eliminar el registro de la BD');
        }
        const data = {
            filePath,
            deleted: true
        };
    
        return res.status(200).json({ mensaje: 'Archivo eliminado con exito', data });
    } catch (error) {
        return handleHttpError(res, "Error al eliminar foto", 500);
    }
}