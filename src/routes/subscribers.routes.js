import express from "express";
import { subscribeToChannel } from "../controllers/subscribers.controller.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/subscribe-channel").post(verifyJWT, subscribeToChannel);

export default router;
