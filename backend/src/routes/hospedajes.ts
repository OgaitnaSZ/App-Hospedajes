import express from "express";
const router = express.Router();
import { getHospedajes, getHospedaje, getHospedajesDestacados, getHospedajesUsuario} from "../controllers/hospedaje";
import * as hospedajeValidators from "../validators/hospedaje";

router.get("/hospedajes", hospedajeValidators.validatorHospedajesFiltro, getHospedajes);
router.get("/hospedaje/:id", hospedajeValidators.validatorHospedaje, getHospedaje);
router.get("/destacados",  getHospedajesDestacados);
router.get("/usuarios/:id/hospedajes",  getHospedajesUsuario);

export { router };