"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorUpdateResenas = exports.validatorUploadResenas = exports.validatorGetResenas = exports.validatorCantidad = exports.validatorId = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorId = [
    (0, express_validator_1.param)("id")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorCantidad = [
    (0, express_validator_1.param)("cantidad")
        .exists().withMessage("La cantidad es obligatoria")
        .notEmpty().withMessage("La cantidad no puede estar vacía")
        .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorGetResenas = [
    (0, express_validator_1.param)("idUsuario")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.param)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.param)("idHabitacion")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUploadResenas = [
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHabitacion")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("calificacion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacio")
        .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),
    (0, express_validator_1.check)("comentario")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacio"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUpdateResenas = [
    (0, express_validator_1.check)("idResena")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHabitacion")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("calificacion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacio"),
    (0, express_validator_1.check)("comentario")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacio"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=resena.js.map