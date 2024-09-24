import express from "express";
import { loginUser, registerUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profile_picture",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

export default router;
