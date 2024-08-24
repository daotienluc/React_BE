require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const products = require("./routes/products");
const authMiddleware = require("./middleware/auth");
const path = require("path");

const app = express();

connectDB();

// Cấu hình để phục vụ tệp tĩnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", products);

app.get("/admin", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Truy cập bị từ chối" });
  }

  res.json({ message: "Chào mừng đến với trang quản trị!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
