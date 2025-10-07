import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const path = require('path');
import routes from "./routes";
import './global-types';
import swaggerUI from 'swagger-ui-express';
import openApiConfiguration from './docs/swagger';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * Documentacion de rutas
 */
app.use('/documentation', 
    swaggerUI.serve,
    swaggerUI.setup(openApiConfiguration)
)

// Importacion dinamica de rutas
app.use("/api", routes);

const port = process.env.PORT || 4001;
app.listen(port, ()=>{
    console.log(`Listo por http://localhost:${port}`);
})

export default app;