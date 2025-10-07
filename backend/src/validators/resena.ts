import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorId = [
    param("id")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorCantidad = [
    param("cantidad")
    .exists().withMessage("La cantidad es obligatoria")
    .notEmpty().withMessage("La cantidad no puede estar vacía"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorGetResenas = [
    param("idUsuario")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    param("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    param("idHabitacion")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorUploadResenas = [
    check("idUsuario")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idHabitacion")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),
        
    check("calificacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio")
    .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),

    check("comentario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorUpdateResenas = [
    check("idResena")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idUsuario")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idHabitacion")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),
        
    check("calificacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("comentario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];