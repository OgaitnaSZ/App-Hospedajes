import express from "express";
const router = express.Router();
import { login , register, updatePassword, recoverPassword, resetPassword} from "../controllers/auth";
import * as authValidators from "../validators/auth";

router.post("/login", authValidators.validatorLogin, login);
router.post("/register", authValidators.validatorRegister, register);
router.post("/update-password", authValidators.validatorUpdatePassword, updatePassword);
router.post("/recover-password", authValidators.validatorRecoverPassword, recoverPassword);
router.post("/reset-password", authValidators.validatorResetPassword, resetPassword);

export { router };
