"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpError = void 0;
const handleHttpError = (res, message = 'Algo sucedió', code = 403) => {
    return res.status(code).json({ error: message });
};
exports.handleHttpError = handleHttpError;
//# sourceMappingURL=handleError.js.map