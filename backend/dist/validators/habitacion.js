"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorHabitaciones = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorHabitaciones = [
    (0, express_validator_1.query)("idHospedaje")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (0, express_validator_1.query)("desde")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.query)("hasta")
        .optional()
        .isLength({ max: 20 }).withMessage("El campo debe tener como máximo 20 caracteres"),
    (0, express_validator_1.query)("capacidad")
        .optional()
        .isLength({ max: 9 }).withMessage("El campo debe tener como máximo 1 caracter"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=habitacion.js.map