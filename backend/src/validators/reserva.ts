import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator"; // Asegúrate de tener este helper

export const validatorReservaHospedaje = [
  check("idUsuario")
    .isUUID().withMessage('El ID del usuario debe ser un UUID válido.'),

  check("idHospedaje")
    .isUUID().withMessage('El ID del hospedaje debe ser un UUID válido.'),

  check("idHabitacion")
    .isUUID().withMessage('El ID de la habitación debe ser un UUID válido.'),

  check("fechaInicio")
    .exists().withMessage('La fecha de inicio es obligatoria.')
    .notEmpty().withMessage('La fecha de inicio no puede estar vacía.'),

  check("fechaFin")
    .exists().withMessage('La fecha de fin es obligatoria.')
    .notEmpty().withMessage('La fecha de fin no puede estar vacía.'),

  check("personas")
    .exists().withMessage('El número de personas es obligatorio.')
    .notEmpty().withMessage('El número de personas no puede estar vacío.')
    .isInt().withMessage('El número de personas debe ser un número entero.'),

  check("precioTotal")
    .exists().withMessage('El precio total es obligatorio.')
    .notEmpty().withMessage('El precio total no puede estar vacío.')
    .isFloat().withMessage('El precio total debe ser un número decimal.'),

  check("nombre")
    .exists().withMessage('El nombre es obligatorio.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),

  check("apellido")
    .exists().withMessage('El apellido es obligatorio.')
    .notEmpty().withMessage('El apellido no puede estar vacío.'),

  check("dni")
    .exists().withMessage('El DNI es obligatorio.')
    .notEmpty().withMessage('El DNI no puede estar vacío.'),

  check("direccion")
    .exists().withMessage('La dirección es obligatoria.')
    .notEmpty().withMessage('La dirección no puede estar vacía.'),

  check("email")
    .exists().withMessage('El correo electrónico es obligatorio.')
    .notEmpty().withMessage('El correo electrónico no puede estar vacío.')
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),

  check("telefono")
    .exists().withMessage('El teléfono es obligatorio.')
    .notEmpty().withMessage('El teléfono no puede estar vacío.'),

  check("idPreferencia")
    .exists().withMessage('El ID de preferencia es obligatorio.')
    .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorReservaActividad = [
  check("idUsuario")
    .isUUID().withMessage('El ID del usuario debe ser un UUID válido.'),

  check("idActividad")
    .isUUID().withMessage('El ID de la actividad debe ser un UUID válido.'),

  check("fecha")
    .exists().withMessage('La fecha es obligatoria.')
    .notEmpty().withMessage('La fecha no puede estar vacía.'),

  check("personas")
    .exists().withMessage('El número de personas es obligatorio.')
    .notEmpty().withMessage('El número de personas no puede estar vacío.'),

  check("precioTotal")
    .exists().withMessage('El precio total es obligatorio.')
    .notEmpty().withMessage('El precio total no puede estar vacío.')
    .isFloat().withMessage('El precio total debe ser un número decimal.'),

  check("nombre")
    .exists().withMessage('El nombre es obligatorio.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),

  check("apellido")
    .exists().withMessage('El apellido es obligatorio.')
    .notEmpty().withMessage('El apellido no puede estar vacío.'),

  check("dni")
    .exists().withMessage('El DNI es obligatorio.')
    .notEmpty().withMessage('El DNI no puede estar vacío.'),

  check("direccion")
    .exists().withMessage('La dirección es obligatoria.')
    .notEmpty().withMessage('La dirección no puede estar vacía.'),

  check("email")
    .exists().withMessage('El correo electrónico es obligatorio.')
    .notEmpty().withMessage('El correo electrónico no puede estar vacío.')
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),

  check("telefono")
    .exists().withMessage('El teléfono es obligatorio.')
    .notEmpty().withMessage('El teléfono no puede estar vacío.'),

  check("idPreferencia")
    .exists().withMessage('El ID de preferencia es obligatorio.')
    .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorTipo = [
  check("id")
    .exists().withMessage('El ID es obligatorio.')
    .notEmpty().withMessage('El ID no puede estar vacío.'),

  check("tipo")
    .exists().withMessage('El tipo es obligatorio.')
    .notEmpty().withMessage('El tipo no puede estar vacío.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];

export const validatorPago = [
  check("idPreferencia")
    .exists().withMessage('El ID de preferencia es obligatorio.')
    .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),

  (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
];
