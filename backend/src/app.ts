import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import './global-types';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4001;

// Importacion dinamica de rutas
app.use("/api", routes);

app.listen(port, ()=>{
    console.log(`Listo por http://localhost:${port}`);
})

export default app;