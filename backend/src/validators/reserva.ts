import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateResults } from "../utils/handleValidator";

export const validatorReservaHospedaje = [
    check("idUsuario")
    .exists()
    .notEmpty(),

    check("idHospedaje")
    .exists()
    .notEmpty(),

    check("idHabitacion")
    .exists()
    .notEmpty(),

    check("fechaInicio")
    .exists()
    .notEmpty(),

    check("fechaFin")
    .exists()
    .notEmpty(),

    check("personas")
    .exists()
    .notEmpty()
    .isInt(),

    check("precioTotal")
    .exists()
    .notEmpty()
    .isFloat(),

    check("nombre")
    .exists()
    .notEmpty(),

    check("apellido")
    .exists()
    .notEmpty(),

    check("dni")
    .exists()
    .notEmpty(),

    check("direccion")
    .exists()
    .notEmpty(),

    check("email")
    .exists()
    .notEmpty()
    .isEmail(),

    check("telefono")
    .exists()
    .notEmpty(),

    check("idPreferencia")
    .exists()
    .notEmpty(),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorReservaActividad = [
    check("idUsuario")
    .exists()
    .notEmpty(),

    check("idActividad")
    .exists()
    .notEmpty(),

    check("fecha")
    .exists()
    .notEmpty(),

    check("personas")
    .exists()
    .notEmpty(),

    check("precioTotal")
    .exists()
    .notEmpty()
    .isFloat(),

    check("nombre")
    .exists()
    .notEmpty(),

    check("apellido")
    .exists()
    .notEmpty(),

    check("dni")
    .exists()
    .notEmpty(),

    check("direccion")
    .exists()
    .notEmpty(),

    check("email")
    .exists()
    .notEmpty()
    .isEmail(),

    check("telefono")
    .exists()
    .notEmpty(),

    check("idPreferencia")
    .exists()
    .notEmpty(),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]

export const validatorTipo = [
    check("id")
    .exists()
    .notEmpty(),

    check("tipo")
    .exists()
    .notEmpty(),

    (req: Request, res: Response, next: NextFunction) => validateResults(req, res, next)
]