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

const corsOptions = {
  origin: [
    'https://app-hospedajes.vercel.app',
    'http://localhost:4200',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

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
const NODE_ENV = process.env.NODE_ENV;
if(NODE_ENV !== 'test') app.listen(port, ()=>{
    console.log("Running in: ", process.env.PUBLIC_URL);
});

export default app;