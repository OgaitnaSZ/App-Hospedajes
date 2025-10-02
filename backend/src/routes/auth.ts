import express from "express";
const router = express.Router();
import { login , register, updatePassword, recoverPasswordStep1, recoverPasswordStep2} from "../controllers/auth";

router.post("/login", login);
router.post("/register", register);
router.post("/update-password", updatePassword);
router.post("/recover-password-1", recoverPasswordStep1);
router.post("/recover-password-2", recoverPasswordStep2);

export { router };
