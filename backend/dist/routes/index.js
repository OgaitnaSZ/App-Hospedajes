"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const PATH_ROUTES = __dirname;
// Detecta si está corriendo el código compilado o en ts-node
const isCompiled = path_1.default.extname(__filename) === ".js";
function removeExtension(fileName) {
    return fileName.split(".").shift();
}
function loadRouter(file) {
    const name = removeExtension(file);
    if (name !== "index") {
        const routerModule = require(path_1.default.join(PATH_ROUTES, file));
        router.use(`/${name}`, routerModule.router);
    }
}
(0, fs_1.readdirSync)(PATH_ROUTES)
    // En dev usa .ts, en prod usa .js
    .filter((file) => {
    const ext = path_1.default.extname(file);
    return isCompiled ? ext === ".js" : ext === ".ts";
})
    .forEach((file) => loadRouter(file));
exports.default = router;
//# sourceMappingURL=index.js.map