import express from "express";
import connectDB from "./DB/index.js";
import dotenv from "dotenv";
import { PORT } from "./constant.js";
const app = express();

dotenv.config({
  path: ".env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error connecting to server", err);
    });
    app.listen(PORT, () => {
      console.log("Server is running on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.log("Error in index:", err);
  });
