import express from "express";
const router = express.Router();
import { updateData, getData, subscribeEmail } from "../controllers/user";
import * as userValidators from "../validators/user";

router.get("/get-data", userValidators.validatorUserData, getData);
router.put("/update-data", userValidators.validatorUserUpdate, updateData);
router.post("/subscribe-email", userValidators.validatorSubscribeEmail, subscribeEmail);

export { router };