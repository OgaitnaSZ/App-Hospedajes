import express from "express";
const router = express.Router();
import * as habitacion from "../controllers/habitacion";
import * as validator from "../validators/habitacion";

router.get("/hospedaje", validator.validatorHabitaciones, habitacion.getHabitaciones);

export { router };