import express from "express";
const router = express.Router();
import { login , register, updatePassword, recoverPassword, resetPassword} from "../controllers/auth";
import * as authValidators from "../validators/auth";
import { authMiddleware } from "../middleware/session";

router.post("/login", authValidators.validatorLogin, login);
router.post("/register", authValidators.validatorRegister, register);
router.post("/update-password", authMiddleware, authValidators.validatorUpdatePassword, updatePassword);
router.post("/recover-password", authValidators.validatorRecoverPassword, recoverPassword);
router.post("/reset-password", authValidators.validatorResetPassword, resetPassword);

export { router };
