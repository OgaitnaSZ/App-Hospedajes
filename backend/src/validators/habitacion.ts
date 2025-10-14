import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHabitaciones = [
    query("idHospedaje")
      .exists().withMessage("El campo es obligatorio")
      .notEmpty().withMessage("El campo no puede estar vacío")
      .isUUID().withMessage('El ID debe ser un UUID válido.'),

    query("desde")
      .optional()
      .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    query("hasta")
      .optional()
      .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),

    query("capacidad")
      .optional()
      .isLength({ max: 9 }).withMessage("El campo debe tener como máximo 1 caracter"),


  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];