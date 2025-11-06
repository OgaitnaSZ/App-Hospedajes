"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorId = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = require("../utils/handleValidator");
exports.validatorId = [
    (0, express_validator_1.param)("id")
        .isUUID().withMessage('El ID debe ser un UUID válido.'),
    (req, res, next) => (0, handleValidator_1.validateResults)(req, res, next)
];
//# sourceMappingURL=foto.js.map