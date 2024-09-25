import { Subscriber } from "../models/subscribers.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channel_id } = req.body;
  if (!channel_id) {
    throw new ApiError(200, "Channel ID is required");
  }
  const sub = await Subscriber.create({
    channel: channel_id,
    subscriber: req.user?._id,
  });
  if (!sub) {
    throw new ApiError(200, "Error while subscribing");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sub, "User logged out successfully"));
});
export { subscribeToChannel };
