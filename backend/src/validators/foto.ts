import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorUploadFoto = [
    check("idHospedaje")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorId = [
    param("id")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];