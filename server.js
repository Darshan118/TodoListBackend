import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import connection from "./model/connection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});

app.use(express.json());

app.use("/todos", todoRoutes); // Ensure routes.js is using `export default router`
const connectDB = async () => {
  try {
    await connection();
  } catch (err) {
    console.log("Error connecting to mongoDB server");
  }
};
connectDB();
