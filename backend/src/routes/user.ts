import express from "express";
const router = express.Router();
import { updateData, getData, subscribeEmail } from "../controllers/user";

router.put("/update-data", updateData);
router.get("/get-data", getData);
router.post("/subscribe-email", subscribeEmail);

export { router };