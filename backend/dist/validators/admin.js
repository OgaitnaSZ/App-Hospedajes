"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorId = exports.validatorUpdateOrder = exports.validatorUploadFoto = exports.validatorActividadUpdate = exports.validatorActividadNew = exports.validatorHabitacionUpdate = exports.validatorHabitacionNew = exports.validatorHospedajeUpdate = exports.validatorHospedajeNew = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorHospedajeNew = [
    (0, express_validator_1.check)("titulo")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("descripcion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("servicios")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("estrellas")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),
    (0, express_validator_1.check)("telefono")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("coordenadas")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorHospedajeUpdate = [
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("titulo")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("descripcion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("servicios")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("estrellas")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isInt({ min: 1, max: 5 }).withMessage("El valor debe estar entre 1 y 5"),
    (0, express_validator_1.check)("telefono")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("coordenadas")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorHabitacionNew = [
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("numero")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("tipo")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("precio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isDecimal().withMessage("El campo debe ser un decimal"),
    (0, express_validator_1.check)("capacidad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isNumeric(),
    (0, express_validator_1.check)("servicios")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorHabitacionUpdate = [
    (0, express_validator_1.check)("idHabitacion")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("numero")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("tipo")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("precio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isDecimal().withMessage("El campo debe ser un decimal"),
    (0, express_validator_1.check)("capacidad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isNumeric(),
    (0, express_validator_1.check)("servicios")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorActividadNew = [
    (0, express_validator_1.check)("nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("descripcion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("imagen")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("precio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorActividadUpdate = [
    (0, express_validator_1.check)("idActividad")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("descripcion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("imagen")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (0, express_validator_1.check)("precio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUploadFoto = [
    (0, express_validator_1.check)("idHospedaje")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUpdateOrder = [
    (0, express_validator_1.check)("fotos")
        .exists(),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorId = [
    (0, express_validator_1.param)("id")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=admin.js.map