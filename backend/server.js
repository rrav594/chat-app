import dotenv from "dotenv";

import mongoose from "mongoose";

import express from "express";
import authroute from "./routes/auth.route.js";

const app = express();
dotenv.config({ path: "../config.env" });

app.use(express.json());

app.use("/api/auth", authroute);

mongoose
  .connect(process.env.DB)
  .then(console.log("Database connected successfully...."));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started...on port ${port}`);
});
