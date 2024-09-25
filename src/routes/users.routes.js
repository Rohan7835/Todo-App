import express from "express";
import {
  changePassword,
  changeProfilePicture,
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
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
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/get-user").post(verifyJWT, getUser);
router.route("/update-user").post(verifyJWT, updateUser);
router
  .route("/change-profile-picture")
  .post(upload.single("profile-picture"), verifyJWT, changeProfilePicture);

router.route("/refreshToken").post(refreshAccessToken);

export default router;
