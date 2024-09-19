import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) return null;
    //upload file on cloudinary
    const res = await cloudinary.uploader.upload(localImagePath, {
      resource_type: "auto",
    });
    return res;
  } catch (error) {
    fs.unlinkSync(localImagePath);
    return;
  }
};

export { uploadOnCloudinary };
