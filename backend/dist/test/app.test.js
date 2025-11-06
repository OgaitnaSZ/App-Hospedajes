"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Prueba unitaria
(0, globals_1.describe)("[APP] Esta es la prueba general", () => {
    (0, globals_1.test)("Esto debe retornar 8", () => {
        const a = 4;
        const b = 4;
        const total = a + b;
        (0, globals_1.expect)(total).toEqual(8);
    });
});
//# sourceMappingURL=app.test.js.map