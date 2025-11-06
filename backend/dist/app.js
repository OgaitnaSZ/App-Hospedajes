"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path = require('path');
const index_1 = __importDefault(require("./routes/index"));
require("./global-types");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./docs/swagger"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        'https://app-hospedajes.vercel.app',
        'http://localhost:4200',
        // Incluye también posibles variantes de Vercel
        /\.vercel\.app$/,
        /\.now\.sh$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'X-API-Key'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path.join(__dirname, 'uploads')));
/**
 * Documentacion de rutas
 */
app.use('/documentation', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Importacion dinamica de rutas
app.use("/api", index_1.default);
const port = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== 'test')
    app.listen(port, () => {
        console.log("Running in: ", process.env.PUBLIC_URL);
    });
exports.default = app;
//# sourceMappingURL=app.js.map