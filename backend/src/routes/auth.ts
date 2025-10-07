import express from "express";
const router = express.Router();
import * as auth from "../controllers/auth";
import * as validator from "../validators/auth";
import { authMiddleware } from "../middleware/session";

router.post("/login", validator.validatorLogin, auth.login);
router.post("/register", validator.validatorRegister, auth.register);
router.post("/update-password", authMiddleware, validator.validatorUpdatePassword, auth.updatePassword);
router.post("/recover-password", validator.validatorRecoverPassword, auth.recoverPassword);
router.post("/reset-password", validator.validatorResetPassword, auth.resetPassword);

export { router };
