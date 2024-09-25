import express from "express";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/users.controller.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/add-category").post(verifyJWT, addCategory);
router.route("/delete-category").post(verifyJWT, deleteCategory);
router.route("/update-category").post(verifyJWT, updateCategory);

export default router;
