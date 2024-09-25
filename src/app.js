import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(cookieParser());

// Routes
import UserRoute from "./routes/users.routes.js";
import SubscriberRoute from "./routes/subscribers.routes.js";

app.use("/api/users", UserRoute);
app.use("/api/subscribers", SubscriberRoute);

export { app };
