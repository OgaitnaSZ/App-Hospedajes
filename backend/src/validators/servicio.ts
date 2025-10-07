import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorServicios = [
    query("tipo")
      .exists().withMessage("El Tipo es obligatorio")
      .notEmpty().withMessage("El Tipo no puede estar vacío")
      .isLength({ max: 10 }).withMessage("El Tipo debe tener como máximo 10 caracteres")
      .isIn(['hospedaje', 'habitacion']).withMessage("Tipo no valido"),


  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];