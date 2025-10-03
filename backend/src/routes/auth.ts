import express from "express";
const router = express.Router();
import { login , register, updatePassword, recoverPassword, resetPassword} from "../controllers/auth";
import { validatorLogin, validatorRegister, validatorUpdatePassword, validatorRecoverPassword, validatorResetPassword } from "../validators/auth";

router.post("/login", validatorLogin, login);
router.post("/register", validatorRegister, register);
router.post("/update-password", validatorUpdatePassword, updatePassword);
router.post("/recover-password", validatorRecoverPassword, recoverPassword);
router.post("/reset-password", validatorResetPassword, resetPassword);

export { router };
