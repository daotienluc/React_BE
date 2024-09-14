import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRouter.js";
import productRouter from "./routes/productRouter.js";
import provinceRouter from "./routes/provinceRouter.js";

const app = express();

// Cấu hình dotenv
import "dotenv/config";

// Cấu hình express
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Kết nối với MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

// Định nghĩa đường dẫn và các middleware
app.get("/", (req, res) => {
  res.send("Welcome");
});

// Cấu hình để phục vụ tệp tĩnh từ thư mục uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Định nghĩa các route
app.use("/api", authRoutes);

// ProvinceRouter
app.use("/api/auth", provinceRouter);

// Thuộc admin
app.use("/api/auth", adminRouter);
app.use("/api/auth", productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
