import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  editProfileDetails,
  getFavouriteBlogs,
  getProfileDetails,
} from "../controllers/profile.controller.js";
const router = express.Router();

router.route("/edit-profile-details").post(verifyJWT, editProfileDetails);
router.route("/get-profile-details").post(verifyJWT, getProfileDetails);
router.route("/get-favourite-blogs").post(verifyJWT, getFavouriteBlogs);

export default router;
