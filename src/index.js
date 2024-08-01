//require("dotenv").config({ path: "./.env" });
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error!", error);
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is listining on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed !!!`, error);
    throw error;
  });

/*
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("error:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is listining on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
})();
*/
