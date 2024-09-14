import express from "express";

import provincesData from "./../controllers/provincesData.js";
const router = express.Router();

// Route để lấy danh sách các tỉnh thành
router.get("/provinces", (req, res) => {
  res.json(provincesData);
});

export default router;
