"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorResetPassword = exports.validatorRecoverPassword = exports.validatorUpdatePassword = exports.validatorRegister = exports.validatorLogin = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorLogin = [
    (0, express_validator_1.check)("email")
        .exists().withMessage("Email requerido")
        .notEmpty().withMessage("Email no puede estar vacío")
        .isEmail().withMessage("Email inválido")
        .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),
    (0, express_validator_1.check)("password")
        .exists().withMessage("Password requerido")
        .notEmpty().withMessage("Password no puede estar vacío")
        .isLength({ min: 5, max: 20 }).withMessage("Password debe tener entre 5 y 20 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorRegister = [
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
    (0, express_validator_1.check)("password")
        .exists().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener entre 5 y 20 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorUpdatePassword = [
    (0, express_validator_1.check)("idUsuario")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.check)("password")
        .exists().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener entre 5 y 20 caracteres"),
    (0, express_validator_1.check)("newPassword")
        .exists().withMessage("La nueva contraseña es requerida")
        .notEmpty().withMessage("La nueva contraseña no puede estar vacía")
        .isLength({ min: 5, max: 20 }).withMessage("La nueva contraseña debe tener entre 5 y 20 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorRecoverPassword = [
    (0, express_validator_1.check)("email")
        .exists().withMessage("El email es requerido")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no es válido")
        .isLength({ max: 30 }).withMessage("El email debe tener como máximo 30 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorResetPassword = [
    (0, express_validator_1.check)("password")
        .exists().withMessage("La contraseña es requerida")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener entre 5 y 20 caracteres"),
    (0, express_validator_1.check)("token")
        .exists().withMessage("El token es requerido")
        .notEmpty().withMessage("El token no puede estar vacío"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=auth.js.map