import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorId = [
    param("id")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El ID no puede estar vacío"),

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
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    param("idHospedaje")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    param("idHabitacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorUploadResenas = [
    check("idUsuario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("idHospedaje")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("idHabitacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),
        
    check("calificacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("comentario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorUpdateResenas = [
    check("idResena")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("idUsuario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("idHospedaje")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("idHabitacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),
        
    check("calificacion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

    check("comentario")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacio"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];