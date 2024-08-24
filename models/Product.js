const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Loại bỏ khoảng trắng thừa
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Đảm bảo giá không âm
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  displayLocation: {
    type: String,
  },
  image: {
    type: String,
  },
  discount: {
    type: String,
    default: "0%", // Cung cấp giá trị mặc định nếu không có giá trị
  },
});

// Tạo index cho categoryId để tăng tốc tìm kiếm theo category
productSchema.index({ categoryId: 1 });

module.exports = mongoose.model("Product", productSchema);
