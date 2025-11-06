"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const pathArchivo = `${__dirname}/../uploads`;
        cb(null, pathArchivo);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const name = file.originalname
            .replace(/\.[^/.]+$/, "") // quitar extensión
            .normalize("NFD") // normalizar acentos
            .replace(/[\u0300-\u036f]/g, "") // eliminar diacríticos
            .replace(/[^a-zA-Z0-9\s]/g, "") // quitar caracteres especiales
            .replace(/\s+/g, "-"); // espacios por guiones
        const filename = `${name}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        // Solo permitir imágenes
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de tipo imagen'));
        }
        cb(null, true);
    },
}).array('fotos', 10); // máximo 10 archivos
//# sourceMappingURL=handleStorage.js.map