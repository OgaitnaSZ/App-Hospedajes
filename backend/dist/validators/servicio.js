"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorServicios = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorServicios = [
    (0, express_validator_1.query)("tipo")
        .exists().withMessage("El Tipo es obligatorio")
        .notEmpty().withMessage("El Tipo no puede estar vacío")
        .isIn(['hospedaje', 'habitacion']).withMessage("Tipo no valido"),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=servicio.js.map