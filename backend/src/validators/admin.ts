import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHospedajeNew = [
    check("titulo")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("descripcion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("servicios")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("estrellas")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),

    check("telefono")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("ciudad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("direccion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("coordenadas")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("imagen")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorHospedajeUpdate = [
    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("titulo")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("descripcion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("servicios")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("estrellas")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),

    check("telefono")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("ciudad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("direccion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("coordenadas")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("imagen")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorHabitacionNew = [
    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("numero")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("tipo")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("precio")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isDecimal().withMessage("El campo debe ser un decimal"),

    check("capacidad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isNumeric(),

    check("servicios")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorHabitacionUpdate = [
    check("idHabitacion")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("numero")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("tipo")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("precio")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isDecimal().withMessage("El campo debe ser un decimal"),

    check("capacidad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío")
    .isNumeric(),

    check("servicios")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorActividadNew = [
    check("nombre")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("descripcion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("imagen")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("ciudad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("precio")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorActividadUpdate = [
    check("idActividad")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    check("nombre")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("descripcion")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("imagen")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("ciudad")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

    check("precio")
    .exists().withMessage("El campo es obligatorio")
    .notEmpty().withMessage("El campo no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorId = [
    param("id")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];