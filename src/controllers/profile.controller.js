import { Profile } from "../models/profile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const editProfileDetails = asyncHandler(async (req, res) => {
  const { bio, instagram_link, theme_preference } = req.body;
  const isProfileExist = await Profile.findOne({ user: req.user?.id });
  if (isProfileExist) {
    isProfileExist.bio = bio;
    isProfileExist.instagram_link = instagram_link;
    isProfileExist.theme_preference = theme_preference;
    isProfileExist.save();
  } else {
    await Profile.create({
      user: req.user?._id,
      bio,
      instagram_link,
      theme_preference,
    });
  }
  res.status(200).json(new ApiResponse(200, {}, "Success"));
});

const getProfileDetails = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user?.id });
  if (!profile) {
    profile = await Profile.create({
      user: req.user?._id,
      bio: "",
      instagram_link: "",
    });
  }
  res.status(200).json(new ApiResponse(200, profile, "Fetched successfully."));
});

const getFavouriteBlogs = asyncHandler(async (req, res) => {
  const blogs = await Profile.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "favourite_blogs",
        foreignField: "_id",
        as: "blogs",
      },
    },
    {
      $project: {
        blogs: 1,
      },
    },
  ]);
  if (!blogs?.[0]) {
    throw new ApiError(400, "Not found");
  }
  res.status(200).json(new ApiResponse(200, blogs[0], "Success"));
});

export { editProfileDetails, getProfileDetails, getFavouriteBlogs };
