import { Blog } from "../models/blogs.model.js";
import { Profile } from "../models/profile.model.js";
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

const markBlogAsFavourite = asyncHandler(async (req, res) => {
  const { blog_id } = req.body;
  const user = req.user?._id;
  if (!blog_id) {
    throw new ApiError(400, "blog_id is required.");
  }
  const userProfile = await Profile.findOne({ user: user });
  if (!userProfile) {
    throw new ApiError(401, "Owner not found");
  }
  if (userProfile?.favourite_blogs?.includes(blog_id)) {
    throw new ApiError(400, "Already marked as favourite");
  }
  userProfile.favourite_blogs.push(blog_id);
  userProfile.save();

  res.status(200).json(new ApiResponse(200, {}, "Marked as favourite"));
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blog_id } = req.body;
  if (!blog_id) {
    throw new ApiError(400, "blog_id is missing.");
  }
  const blog = await Blog.findById(blog_id);
  if (!blog) {
    throw new ApiError(400, "Blog not found");
  }
  blog.likes.push(req.user?._id);
  blog.save();
  res.status(200).json(new ApiResponse(200, {}, "Blog liked successfully."));
});

export { addBlog, getBlogs, markBlogAsFavourite, likeBlog };
