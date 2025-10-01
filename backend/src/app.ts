import express, { Express, Request, Response } from "express";

const PORT = 4000;
const app = express();

app.get('/', (req: Request, res: Response)=>{
    res.send({
         message: 'Hola mundo'
    })
})

app.listen(PORT, ()=>{
    console.log("Listo por el puerto 3000");
})