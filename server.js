import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(routes); // Ensure routes.js is using `export default router`

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
