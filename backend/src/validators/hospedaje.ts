import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHospedajesFiltro = [
    param("Ciudad")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("FechaInicio")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("FechaFin")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    param("Capacidad")
    .optional()
    .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorHospedaje = [
    param("id")
    .exists().withMessage("El ID es obligatorio")
    .notEmpty().withMessage("El ID no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];