import express from "express";
const router = express.Router();
import { getHabitaciones,} from "../controllers/habitacion";
import * as habitacionValidators from "../validators/habitacion";

router.get("/hospedaje", habitacionValidators.validatorHabitaciones, getHabitaciones);

export { router };