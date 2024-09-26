import { Profile } from "../models/profile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export { editProfileDetails, getProfileDetails };
