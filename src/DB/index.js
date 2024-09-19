import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const connectionInstance = mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB Host: ${
        (await connectionInstance).Connection.host
      }`
    );
  } catch (error) {
    console.log("Failed at error: ", error);
  }
};

export default connectDB;
