import express from "express";
const router = express.Router();
import * as hospedaje from "../controllers/hospedaje";
import * as validator from "../validators/hospedaje";

router.get("/hospedajes", validator.validatorHospedajesFiltro, hospedaje.getHospedajes);
router.get("/hospedaje/:id", validator.validatorId, hospedaje.getHospedaje);
router.get("/destacados",  hospedaje.getHospedajesDestacados);

export { router };