import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    throw new ApiError(401, "Refresh Token is required");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }
    if (token !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }
    const { accessToken, refreshToken } = await generateAccess_RefreshTokens(
      user?._id
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };
    const updatedUser = await User.findById(decodedToken._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { updatedUser, accessToken, refreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Invalid refresh");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }
  const user = await User.findById(req.user);
  const isPassCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPassCorrect) {
    throw new ApiError(400, "Incorrect Old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
});
const updateUser = asyncHandler(async (req, res) => {
  const { fullname, email, mobile } = req.body;
  if (!fullname && !email && !mobile) {
    throw new ApiError(400, "Please fill all details");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullname, email, mobile },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});
const changeProfilePicture = asyncHandler(async (req, res) => {
  const profile_picture_localpath = req.file?.path;

  if (!profile_picture_localpath) {
    throw new ApiError(400, "Profile picture is required.");
  }
  const profile_picture = await uploadOnCloudinary(profile_picture_localpath);
  if (!profile_picture) {
    throw new ApiError(400, "Error occured while uploading file to server.");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { profile_picture: profile_picture.url },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Profile picture updated successfully"));
});

const getUserChannelProfileDetails = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username) {
    throw new ApiError(401, "Username is required.");
  }
  const channelData = await User.aggregate([
    {
      $match: { username },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        profile_picture: 1,
        email: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  if (!channelData?.length) {
    throw new ApiError(401, "Data not found");
  }
  res.status(200).json(new ApiResponse(200, channelData[0], "Success"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getUser,
  updateUser,
  changeProfilePicture,
  getUserChannelProfileDetails,
};
