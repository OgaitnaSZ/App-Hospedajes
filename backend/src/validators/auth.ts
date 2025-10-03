import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

const validatorLogin = [
  check("email")
    .exists().withMessage("Email requerido")
    .notEmpty().withMessage("Email no puede estar vacío")
    .isEmail().withMessage("Email inválido")
    .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),

  check("password")
    .exists().withMessage("Password requerido")
    .notEmpty().withMessage("Password no puede estar vacío")
    .isLength({ min: 6, max: 20 }).withMessage("Password debe tener entre 6 y 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];


const validatorRegister = [
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

  check("password")
    .exists().withMessage("La contraseña es requerida")
    .notEmpty().withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

const validatorUpdatePassword = [
  check("idUsuario")
    .exists().withMessage("El IdUsuario es requerido")
    .notEmpty().withMessage("El IdUsuario no puede estar vacío"),
  
  check("password")
    .exists().withMessage("La contraseña es requerida")
    .notEmpty().withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),

  check("newPassword")
    .exists().withMessage("La nueva contraseña es requerida")
    .notEmpty().withMessage("La nueva contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 }).withMessage("La nueva contraseña debe tener entre 6 y 20 caracteres"),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

const validatorRecoverPassword = [
  check("email")
    .exists().withMessage("El email es requerido")
    .notEmpty().withMessage("El email no puede estar vacío")
    .isEmail().withMessage("El email no es válido")
    .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export { validatorLogin, validatorRegister, validatorUpdatePassword, validatorRecoverPassword };
