import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "registered successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logged in successfully" });
});

export { registerUser, loginUser };
