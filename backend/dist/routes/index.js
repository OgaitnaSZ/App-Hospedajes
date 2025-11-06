"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const PATH_ROUTES = __dirname;
function removeExtension(fileName) {
    const cleanFileName = fileName.split(".").shift();
    return cleanFileName;
}
function loadRouter(file) {
    const name = removeExtension(file);
    if (name !== "index") {
        const routerModule = require(`./${file}`);
        router.use(`/${name}`, routerModule.router);
    }
}
(0, fs_1.readdirSync)(PATH_ROUTES).filter((file) => loadRouter(file));
exports.default = router;
//# sourceMappingURL=index.js.map