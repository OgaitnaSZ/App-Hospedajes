"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorId = exports.validatorHospedajesFiltro = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorHospedajesFiltro = [
    (0, express_validator_1.query)("ciudad")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.query)("fechaInicio")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.query)("fechaFin")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.query)("capacidad")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
exports.validatorId = [
    (0, express_validator_1.param)("id")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=hospedaje.js.map