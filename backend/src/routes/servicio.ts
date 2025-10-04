import express from "express";
const router = express.Router();
import { getServicios } from "../controllers/servicio";
import { validatorServicios } from "../validators/servicio";

router.get("/", validatorServicios, getServicios);

export { router };