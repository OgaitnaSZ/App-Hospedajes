import express from "express";
const router = express.Router();
import { login , register, updatePassword, recoverPasswordStep1, recoverPasswordStep2} from "../controllers/auth";
import { validatorLogin, validatorRegister } from "../validators/auth";

router.post("/login", validatorLogin, login);
router.post("/register", validatorRegister, register);
router.post("/update-password", updatePassword);
router.post("/recover-password-1", recoverPasswordStep1);
router.post("/recover-password-2", recoverPasswordStep2);

export { router };
