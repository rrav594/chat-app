import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";

import express from "express";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config({ path: "../config.env" });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.use("/api/users", userRoute);

mongoose
  .connect(process.env.DB)
  .then(console.log("Database connected successfully...."));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started...on port ${port}`);
});
