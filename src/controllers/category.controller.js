import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const deleteCategory = asyncHandler(async (req, res) => {});

const updateCategory = asyncHandler(async (req, res) => {});

export { addCategory, deleteCategory, updateCategory };
