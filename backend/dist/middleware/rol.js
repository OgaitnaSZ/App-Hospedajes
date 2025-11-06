"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRol = void 0;
const handleError_1 = require("../utils/handleError");
const checkRol = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.rol) {
                return (0, handleError_1.handleHttpError)(res, "USER_NOT_FOUND_OR_INVALID", 401);
            }
            const userRole = user.rol;
            if (!allowedRoles.includes(userRole)) {
                return (0, handleError_1.handleHttpError)(res, "USER_NOT_PERMISSIONS", 403);
            }
            next();
        }
        catch (e) {
            (0, handleError_1.handleHttpError)(res, "ERROR_PERMISSIONS", 403);
        }
    };
};
exports.checkRol = checkRol;
//# sourceMappingURL=rol.js.map