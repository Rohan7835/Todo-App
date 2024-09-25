import { Subscribers } from "../models/subscribers.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channel_id } = req.body;
  if (!channel_id) {
    throw new ApiError(200, "Channel ID is required");
  }
  const owner_user = await User.findById(channel_id).select(
    "-password -refreshToken"
  );
  const sub_user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  const sub = await Subscribers.create({
    channel: owner_user,
    subscriber: sub_user,
  });
  if (!sub) {
    throw new ApiError(200, "Error while subscribing");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sub, "User logged out successfully"));
});
export { subscribeToChannel };
