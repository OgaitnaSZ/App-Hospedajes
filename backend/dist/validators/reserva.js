"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorPago = exports.validatorTipo = exports.validatorReservaActividad = exports.validatorReservaHospedaje = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator"); // Asegúrate de tener este helper
exports.validatorReservaHospedaje = [
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID del usuario debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID del hospedaje debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHabitacion")
        .isUUID().withMessage('El ID de la habitación debe ser un UUID válido.'),
    (0, express_validator_1.check)("fechaInicio")
        .exists().withMessage('La fecha de inicio es obligatoria.')
        .notEmpty().withMessage('La fecha de inicio no puede estar vacía.'),
    (0, express_validator_1.check)("fechaFin")
        .exists().withMessage('La fecha de fin es obligatoria.')
        .notEmpty().withMessage('La fecha de fin no puede estar vacía.'),
    (0, express_validator_1.check)("personas")
        .exists().withMessage('El número de personas es obligatorio.')
        .notEmpty().withMessage('El número de personas no puede estar vacío.')
        .isInt().withMessage('El número de personas debe ser un número entero.'),
    (0, express_validator_1.check)("precioTotal")
        .exists().withMessage('El precio total es obligatorio.')
        .notEmpty().withMessage('El precio total no puede estar vacío.')
        .isFloat().withMessage('El precio total debe ser un número decimal.'),
    (0, express_validator_1.check)("nombre")
        .exists().withMessage('El nombre es obligatorio.')
        .notEmpty().withMessage('El nombre no puede estar vacío.'),
    (0, express_validator_1.check)("apellido")
        .exists().withMessage('El apellido es obligatorio.')
        .notEmpty().withMessage('El apellido no puede estar vacío.'),
    (0, express_validator_1.check)("dni")
        .exists().withMessage('El DNI es obligatorio.')
        .notEmpty().withMessage('El DNI no puede estar vacío.'),
    (0, express_validator_1.check)("direccion")
        .exists().withMessage('La dirección es obligatoria.')
        .notEmpty().withMessage('La dirección no puede estar vacía.'),
    (0, express_validator_1.check)("email")
        .exists().withMessage('El correo electrónico es obligatorio.')
        .notEmpty().withMessage('El correo electrónico no puede estar vacío.')
        .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),
    (0, express_validator_1.check)("telefono")
        .exists().withMessage('El teléfono es obligatorio.')
        .notEmpty().withMessage('El teléfono no puede estar vacío.'),
    (0, express_validator_1.check)("idPreferencia")
        .exists().withMessage('El ID de preferencia es obligatorio.')
        .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorReservaActividad = [
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID del usuario debe ser un UUID válido.'),
    (0, express_validator_1.check)("idActividad")
        .isUUID().withMessage('El ID de la actividad debe ser un UUID válido.'),
    (0, express_validator_1.check)("fecha")
        .exists().withMessage('La fecha es obligatoria.')
        .notEmpty().withMessage('La fecha no puede estar vacía.'),
    (0, express_validator_1.check)("personas")
        .exists().withMessage('El número de personas es obligatorio.')
        .notEmpty().withMessage('El número de personas no puede estar vacío.'),
    (0, express_validator_1.check)("precioTotal")
        .exists().withMessage('El precio total es obligatorio.')
        .notEmpty().withMessage('El precio total no puede estar vacío.')
        .isFloat().withMessage('El precio total debe ser un número decimal.'),
    (0, express_validator_1.check)("nombre")
        .exists().withMessage('El nombre es obligatorio.')
        .notEmpty().withMessage('El nombre no puede estar vacío.'),
    (0, express_validator_1.check)("apellido")
        .exists().withMessage('El apellido es obligatorio.')
        .notEmpty().withMessage('El apellido no puede estar vacío.'),
    (0, express_validator_1.check)("dni")
        .exists().withMessage('El DNI es obligatorio.')
        .notEmpty().withMessage('El DNI no puede estar vacío.'),
    (0, express_validator_1.check)("direccion")
        .exists().withMessage('La dirección es obligatoria.')
        .notEmpty().withMessage('La dirección no puede estar vacía.'),
    (0, express_validator_1.check)("email")
        .exists().withMessage('El correo electrónico es obligatorio.')
        .notEmpty().withMessage('El correo electrónico no puede estar vacío.')
        .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),
    (0, express_validator_1.check)("telefono")
        .exists().withMessage('El teléfono es obligatorio.')
        .notEmpty().withMessage('El teléfono no puede estar vacío.'),
    (0, express_validator_1.check)("idPreferencia")
        .exists().withMessage('El ID de preferencia es obligatorio.')
        .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorTipo = [
    (0, express_validator_1.check)("id")
        .exists().withMessage('El ID es obligatorio.')
        .notEmpty().withMessage('El ID no puede estar vacío.'),
    (0, express_validator_1.check)("tipo")
        .exists().withMessage('El tipo es obligatorio.')
        .notEmpty().withMessage('El tipo no puede estar vacío.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorPago = [
    (0, express_validator_1.check)("idPreferencia")
        .exists().withMessage('El ID de preferencia es obligatorio.')
        .notEmpty().withMessage('El ID de preferencia no puede estar vacío.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=reserva.js.map