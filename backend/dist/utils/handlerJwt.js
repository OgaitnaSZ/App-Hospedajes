"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.tokenSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en el archivo .env");
}
/**
*Pasar el objeto usuario
* @param {*} usuario
*/
const tokenSign = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign({
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre
    }, JWT_SECRET, {
        expiresIn: "12h"
    });
});
exports.tokenSign = tokenSign;
/**
 * Pasar token de session
 * @param {*} tokenJwt
 * @returns
 */
const verifyToken = (tokenJwt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return jsonwebtoken_1.default.verify(tokenJwt, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=handlerJwt.js.map