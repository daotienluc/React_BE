// backend/routes/products.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("./../models/Product.js");
const upload = multer({ dest: "uploads/" });

router.post("/products", upload.single("image"), async (req, res) => {
  try {
    // Kiểm tra `req.file` có tồn tại không
    if (!req.file) {
      return res.status(400).json({ message: "Hình ảnh là bắt buộc." });
    }
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      description: req.body.description,
      displayLocation: req.body.displayLocation,
      image: req.file.path,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy chi tiết sản phẩm
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).json({ message: error.message });
  }
});

// Lấy chi tiết sản phẩm theo ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tìm kiếm sản phẩm
router.get("/products/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Từ khóa tìm kiếm là bắt buộc." });
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
