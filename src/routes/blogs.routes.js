import express from "express";
import { subscribeToChannel } from "../controllers/subscribers.controller.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addBlog, getBlogs } from "../controllers/blogs.controllers.js";
const router = express.Router();

router.route("/add-blog").post(verifyJWT, addBlog);
router.route("/get-blogs").post(verifyJWT, getBlogs);

export default router;
