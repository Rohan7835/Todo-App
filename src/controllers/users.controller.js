import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, mobile } = req.body;
  if (!username || !fullname || !email || !password || !mobile) {
    throw new ApiError(400, "Please fill all details");
  }
  const existed = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existed) {
    throw new ApiError(400, "Username or email already exists.");
  }
  const profile_picture_localpath = req.files?.profile_picture[0]?.path;
  if (!profile_picture_localpath) {
    throw new ApiError(400, "Profile picture is required.");
  }
  const profile_pictureURL = await uploadOnCloudinary(
    profile_picture_localpath
  );

  if (!profile_pictureURL) {
    throw new ApiError(400, "Profile picture is required.");
  }

  const createdUser = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    mobile,
    profile_picture: profile_pictureURL.url,
  });

  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "Something went wrong while register.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logged in successfully" });
});

export { registerUser, loginUser };
