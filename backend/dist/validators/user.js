"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorSubscribeEmail = exports.validatorUserUpdate = exports.validatorUserData = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorUserData = [
    (0, express_validator_1.param)("id")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUserUpdate = [
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("nombre")
        .exists().withMessage("El nombre es requerido")
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ max: 30 }).withMessage("El nombre debe tener como máximo 30 caracteres"),
    (0, express_validator_1.check)("apellido")
        .exists().withMessage("El apellido es requerido")
        .notEmpty().withMessage("El apellido no puede estar vacío")
        .isLength({ max: 20 }).withMessage("El apellido debe tener como máximo 20 caracteres"),
    (0, express_validator_1.check)("email")
        .exists().withMessage("El email es requerido")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no es válido")
        .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),
    (0, express_validator_1.check)("telefono")
        .optional()
        .isString().withMessage("El teléfono debe ser un texto")
        .isLength({ max: 20 }).withMessage("El teléfono debe tener como máximo 20 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorSubscribeEmail = [
    (0, express_validator_1.check)("email")
        .exists().withMessage("El email es requerido")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no es válido")
        .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=user.js.map