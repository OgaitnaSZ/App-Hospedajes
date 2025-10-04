import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHospedaje = [
    check("titulo")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("descripcion")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("servicios")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("estrellas")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("telefono")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("ciudad")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("direccion")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("coordenadas")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    check("imagen")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorId = [
    param("id")
    .exists().withMessage("El ID es obligatorio")
    .notEmpty().withMessage("El ID no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];