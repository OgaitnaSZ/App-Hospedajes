import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorHabitaciones = [
    query("IdHospedaje")
      .exists().withMessage("El campo 'IdHospedaje' es obligatorio")
      .notEmpty().withMessage("El campo 'IdHospedaje' no puede estar vacío"),

    query("Desde")
      .exists().withMessage("El campo 'Desde' es obligatorio")
      .notEmpty().withMessage("El campo 'Desde' no puede estar vacío"),

    query("Hasta")
      .exists().withMessage("El campo 'Hasta' es obligatorio")
      .notEmpty().withMessage("El campo 'Hasta' no puede estar vacío"),

    query("Capacidad")
      .exists().withMessage("El campo 'Capacidad' es obligatorio")
      .notEmpty().withMessage("El campo 'Capacidad' no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];