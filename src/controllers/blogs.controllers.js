import { Blog } from "../models/blogs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addBlog = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Blog added successfully."));
});

export { addBlog };
