import { Subscribers } from "../models/subscribers.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addSubscribers = asyncHandler(async (req, res) => {
  await Subscribers.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export { addSubscribers };
