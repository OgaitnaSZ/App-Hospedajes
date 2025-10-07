import express from "express";
const router = express.Router();
import * as user from "../controllers/user";
import * as validator from "../validators/user";
import { authMiddleware } from "../middleware/session";

router.get("/get-data", authMiddleware, validator.validatorUserData, user.getData);
router.put("/update-data", authMiddleware, validator.validatorUserUpdate, user.updateData);
router.post("/subscribe-email", validator.validatorSubscribeEmail, user.subscribeEmail);

export { router };