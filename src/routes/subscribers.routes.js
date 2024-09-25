import express from "express";
import { addSubscribers } from "../controllers/subscribers.controller.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/add-subscribers").post(verifyJWT, addSubscribers);

export default router;
