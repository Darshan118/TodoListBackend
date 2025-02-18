import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; //check where and how DB name is specified which needs to be created in .env file.

const connection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection successful");
  } catch (err) {
    console.log(err);
  }
};

export default connection;
