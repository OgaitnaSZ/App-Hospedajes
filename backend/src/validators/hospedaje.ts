import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHospedajesFiltro = [
    param("ciudad")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("fechaInicio")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("fechaFin")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("capacidad")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorId = [
    param("id")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];