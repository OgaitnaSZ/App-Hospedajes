import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorServicios = [
    query("Tipo")
      .exists().withMessage("El campo 'Tipo' es obligatorio")
      .notEmpty().withMessage("El campo 'Tipo' no puede estar vacío")
      .isLength({ max: 10 }).withMessage("El campo debe tener como máximo 10 caracteres")
      .isIn(['hospedaje', 'habitacion']).withMessage("El campo 'Tipo' solo puede ser 'hospedaje' o 'habitacion'"),


  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];