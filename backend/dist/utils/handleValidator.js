"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResults = void 0;
const express_validator_1 = require("express-validator");
const validateResults = (req, res, next) => {
    try {
        (0, express_validator_1.validationResult)(req).throw();
        return next(); //Continua hacia el controlador
    }
    catch (error) {
        res.status(403);
        res.send({ errors: error.array() });
    }
};
exports.validateResults = validateResults;
//# sourceMappingURL=handleValidator.js.map