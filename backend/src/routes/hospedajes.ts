import express from "express";
const router = express.Router();
import { getHospedajes, getHospedaje, getHospedajesDestacados} from "../controllers/hospedaje";
import * as hospedajeValidators from "../validators/hospedaje";

router.get("/hospedajes", hospedajeValidators.validatorHospedajesFiltro, getHospedajes);
router.get("/hospedaje/:id", hospedajeValidators.validatorId, getHospedaje);
router.get("/destacados",  getHospedajesDestacados);

export { router };