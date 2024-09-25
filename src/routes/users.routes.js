import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
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

//protected
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

export default router;
