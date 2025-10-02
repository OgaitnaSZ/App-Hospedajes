import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4001;

// Importacion dinamica de rutas
app.use("/api", routes);

app.listen(PORT, ()=>{
    console.log(`Listo por http://localhost:${PORT}`);
})

export default app;