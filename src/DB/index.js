import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB Host: ${connectionInstance.Collection.host}`
    );
  } catch (error) {
    console.log("Failed at error: ", error);
  }
};

export default connectDB;
