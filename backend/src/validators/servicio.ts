import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorServicios = [
    query("tipo")
      .exists().withMessage("El Tipo es obligatorio")
      .notEmpty().withMessage("El Tipo no puede estar vacío")
      .isIn(['hospedaje', 'habitacion']).withMessage("Tipo no valido"),


  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];