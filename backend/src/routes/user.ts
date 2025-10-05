import express from "express";
const router = express.Router();
import { updateData, getData, subscribeEmail } from "../controllers/user";
import * as userValidators from "../validators/user";
import { authMiddleware } from "../middleware/session";

router.get("/get-data", authMiddleware, userValidators.validatorUserData, getData);
router.put("/update-data", authMiddleware, userValidators.validatorUserUpdate, updateData);
router.post("/subscribe-email", userValidators.validatorSubscribeEmail, subscribeEmail);

export { router };