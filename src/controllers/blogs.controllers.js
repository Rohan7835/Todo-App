import { Blog } from "../models/blogs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title or description is missing.");
  }
  const _blog = await Blog.create({
    title,
    description,
    owner: req.user?._id,
  });
  res.status(200).json(new ApiResponse(200, _blog, "Blog added successfully."));
});

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ owner: req.user?._id });
  if (!blogs?.length) {
    throw new ApiError(401, "Data not found");
  }
  res.status(200).json(new ApiResponse(200, blogs, "Success"));
});

export { addBlog, getBlogs };
