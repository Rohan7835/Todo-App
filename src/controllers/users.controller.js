import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccess_RefreshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);
    console.log("USER>>>>>", user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error token:", error);
    throw new ApiError(402, "Error while creating tokens.");
  }
};

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, mobile } = req.body;
  if (!username || !fullname || !email || !password || !mobile) {
    throw new ApiError(400, "Please fill all details");
  }
  const existed = await User.findOne({
    $or: [{ username }, { email }, { mobile }],
  });
  if (existed) {
    throw new ApiError(400, "Username, email or mobile already exists.");
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
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please fill email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccess_RefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  return (
    res
      .status(200)
      // .cookie("accessToken", accessToken, cookieOptions)
      // .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, { user: req.user }, "User logged in successfully")
      )
  );
});

export { registerUser, loginUser, logoutUser };
