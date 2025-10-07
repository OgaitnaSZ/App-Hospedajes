import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorUserData = [
  check("idUsuario")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorUserUpdate = [
  check("idUsuario")
    .isUUID().withMessage('El ID debe ser un UUID válido.'),

  check("nombre")
    .exists().withMessage("El nombre es requerido")
    .notEmpty().withMessage("El nombre no puede estar vacío")
    .isLength({ max: 30 }).withMessage("El nombre debe tener como máximo 30 caracteres"),

  check("apellido")
    .exists().withMessage("El apellido es requerido")
    .notEmpty().withMessage("El apellido no puede estar vacío")
    .isLength({ max: 20 }).withMessage("El apellido debe tener como máximo 20 caracteres"),

  check("email")
    .exists().withMessage("El email es requerido")
    .notEmpty().withMessage("El email no puede estar vacío")
    .isEmail().withMessage("El email no es válido")
    .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),

  check("telefono")
    .optional()
    .isString().withMessage("El teléfono debe ser un texto")
    .isLength({ max: 20 }).withMessage("El teléfono debe tener como máximo 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorSubscribeEmail = [
  check("email")
    .exists().withMessage("El email es requerido")
    .notEmpty().withMessage("El email no puede estar vacío")
    .isEmail().withMessage("El email no es válido")
    .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];