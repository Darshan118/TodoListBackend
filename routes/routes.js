import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>API is working!</h1>");
});

export default router;
