import express from "express";
const router = express.Router();
import * as servicio from "../controllers/servicio";
import * as validator from "../validators/servicio";

router.get("/", validator.validatorServicios, servicio.getServicios);

export { router };