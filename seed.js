const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Xóa tất cả dữ liệu cũ
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Thêm dữ liệu mẫu
    const category = await Category.create({
      name: "Danh mục 1",
      description: "Mô tả danh mục 1",
    });

    await Product.create({
      name: "Laptop Acer Nitro 16 Phoenix AN16-41-R5M4",
      description:
        "Laptop Acer Nitro 16 Phoenix AN16-41-R5M4 (NH.QKBSV.003) (AMD Ryzen 5-7535HS) (Đen)",
      price: 10000000, // Giá sản phẩm (dùng số)
      categoryId: category._id,
      image: "laptopgaming01", // Đường dẫn hoặc tên hình ảnh
      discount: "4.000.000đ", // Giảm giá
      brand: "ACER", // Thương hiệu
    });

    console.log("Dữ liệu mẫu đã được thêm thành công!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu mẫu:", error);
    mongoose.connection.close();
  }
};

seedData();
