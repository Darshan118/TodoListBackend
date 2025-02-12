import express from "express";
import connection from "../model/connection.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>API is working!</h1>");
});

const connectDB = async () => {
  try {
    await connection();
  } catch (err) {
    console.log("Error connecting to mongoDB server");
  }
};
connectDB();

export default router;
