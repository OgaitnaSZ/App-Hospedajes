import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorUploadFoto = [
    check("IdHospedaje")
    .exists()
    .notEmpty(),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorId = [
    param("id")
    .exists().withMessage("El ID es obligatorio")
    .notEmpty().withMessage("El ID no puede estar vacío"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];