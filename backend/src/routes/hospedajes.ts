import express from "express";
const router = express.Router();
import { getHospedajes, getHospedaje, getHospedajesDestacados, getHospedajesUsuario} from "../controllers/hospedaje";
import * as authValidators from "../validators/auth";

router.get("/", getHospedajes);
router.get("/:id", authValidators.validatorLogin, getHospedaje);
router.get("/destacados", authValidators.validatorLogin, getHospedajesDestacados);
router.get("/usuarios/:id/hospedajes", authValidators.validatorLogin, getHospedajesUsuario);

export { router };