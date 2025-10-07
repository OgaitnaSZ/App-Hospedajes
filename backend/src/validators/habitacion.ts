import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHabitaciones = [
    query("idHospedaje")
      .isUUID().withMessage('El ID debe ser un UUID válido.'),

    query("desde")
      .exists().withMessage("El campo 'Desde' es obligatorio")
      .notEmpty().withMessage("El campo 'Desde' no puede estar vacío"),

    query("hasta")
      .exists().withMessage("El campo 'Hasta' es obligatorio")
      .notEmpty().withMessage("El campo 'Hasta' no puede estar vacío"),

    query("capacidad")
      .exists().withMessage("El campo 'Capacidad' es obligatorio")
      .notEmpty().withMessage("El campo 'Capacidad' no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];