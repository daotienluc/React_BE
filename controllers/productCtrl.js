import { Products } from "../models/products.js";
import Cart from "../models/cart.js";
import multer from "multer";

// Cấu hình multer lưu hình
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đặt tên file
  },
});

const calculateItemPrice = async (productId, quantity) => {
  try {
    const product = await Products.findById(productId);
    return product ? quantity * product.price : 0;
  } catch (error) {
    console.error(`Error fetching product price: ${error}`);
    return 0;
  }
};

const upload = multer({ storage: storage });

const productCtrl = {
  createProduct: async (req, res) => {
    try {
      const { status } = req.body;
      //  upload hình ảnh
      upload.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: "Lỗi khi upload hình ảnh." });
        }

        if (!req.file) {
          return res.status(400).json({ message: "Hình ảnh là bắt buộc." });
        }

        // Xử lý dữ liệu mô tả
        let description;
        try {
          description = JSON.parse(req.body.description);
          if (!Array.isArray(description)) {
            throw new Error("Mô tả phải là một mảng.");
          }
        } catch (error) {
          return res.status(400).json({ message: "Mô tả phải là một mảng." });
        }

        // Tạo sản phẩm mới
        const newProduct = new Products({
          name: req.body.name,
          brand: req.body.brand,
          price: req.body.price,
          discount: req.body.discount,
          descriptionShort: req.body.descriptionShort,
          description: description,
          displayLocation: req.body.displayLocation,
          image: req.file.path,
          status,
        });

        await newProduct.save();
        res.status(200).json(newProduct);
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // admin
  getProduct: async (req, res) => {
    try {
      const products = await Products.find({});
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(400).json({ message: error.message });
    }
  },
  // user
  getProductUser: async (req, res) => {
    try {
      const products = await Products.find({ status: "Active" });
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(400).json({ message: error.message });
    }
  },
  // all
  getProductByIdAndName: async (req, res) => {
    try {
      const { productId, productName } = req.params;

      if (!productId || !productName) {
        return res
          .status(400)
          .json({ success: false, message: "Thông tin sản phẩm không hợp lệ" });
      }

      const product = await Products.findOne({
        _id: productId,
        name: productName,
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không tìm thấy" });
      }

      res.status(200).json({ data: product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: error.message });
    }
  },

  changeSatusProduct: async (req, res) => {
    try {
      const { product_id } = req.params;
      const { newStatus } = req.body;
      const product = await Products.findById(product_id);
      if (!product_id) {
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không tìm thấy" });
      }

      const currentStatus = product.status;

      const validTransitions = {
        Active: ["Hidden", "Delete"],
        Hidden: ["Active", "Delete"],
        Delete: ["Hidden"],
      };
      if (!validTransitions[currentStatus].includes(newStatus)) {
        return res.json({
          success: false,
          message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        });
      }
      product.status = newStatus;
      await product.save();
      return res.json({
        success: true,
        message: `Quiz status has been changed from ${currentStatus} to ${newStatus} successfully`,
      });
    } catch (error) {
      return res.json({ success: false, message: "Server error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Sản phẩm đã được xóa." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { nameT } = req.query;

      if (!nameT) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
      }

      // tìm kiếm phần name của tên sản phẩm ( dùng regex)
      const products = await Products.find({
        name: { $regex: nameT, $options: "i" },
      });

      console.log(`Kết quả tìm kiếm: ${JSON.stringify(products)}`);

      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm phù hợp." });
      }

      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi trong quá trình tìm kiếm sản phẩm." });
    }
  },
  // Lực theemmmmmmmmmmmmmmmm testttt
  AddProductsCart: async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await Products.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Tìm giỏ hàng của user
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // Tạo giỏ hàng mới nếu chưa có
        cart = new Cart({ userId, items: [] });
      }

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Nếu chưa có, thêm sản phẩm vào giỏ hàng
        cart.items.push({ product: productId, quantity });
      }

      // Tính toán lại tổng giá
      let totalPrice = 0;
      for (const item of cart.items) {
        const productDetails = await Products.findById(item.product);
        totalPrice += productDetails.price * item.quantity;
      }

      cart.totalPrice = totalPrice;

      // Lưu giỏ hàng
      await cart.save();

      return res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  GetCart: async (req, res) => {
    const { userId } = req.params;

    try {
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ userId }).populate("items.product");

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Trả về giỏ hàng
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  removeProductFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.params;

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Ghi log để kiểm tra giá trị

      // Lọc bỏ sản phẩm có productId trong giỏ hàng
      const updatedItems = cart.items.filter((item) => {
        // Chuyển đổi item.product và productId về cùng kiểu để so sánh
        const itemProductId = item.product.toString();
        const isMatch = itemProductId === productId;
        return !isMatch;
      });

      // Nếu không còn sản phẩm nào trong giỏ hàng, xóa giỏ hàng
      if (updatedItems.length === 0) {
        await Cart.findOneAndDelete({ userId });
        return res.status(200).json({ message: "Đã Xóa hết sản phẩm" });
      }

      // Tính toán lại tổng giá
      const totalPricePromises = updatedItems.map((item) =>
        calculateItemPrice(item.product, item.quantity)
      );
      const totalPrices = await Promise.all(totalPricePromises);
      const totalPrice = totalPrices.reduce((total, price) => total + price, 0);

      // Cập nhật giỏ hàng với danh sách sản phẩm đã loại bỏ sản phẩm cụ thể
      cart.items = updatedItems;
      cart.totalPrice = totalPrice;
      await cart.save();

      return res
        .status(200)
        .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng", cart });
    } catch (error) {
      return res.status(500).json({ message: "Xóa sản phẩm thất bại", error });
    }
  },

  updateProductCart: async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body; // quantity should be handled properly

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }

      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        // Handle increasing or decreasing quantity
        const currentQuantity = cart.items[productIndex].quantity;

        // If decreasing quantity, ensure it doesn't go below 1
        if (quantity < 1) {
          return res
            .status(400)
            .json({ message: "Số lượng sản phẩm không thể nhỏ hơn 1" });
        }

        cart.items[productIndex].quantity = quantity;
        await cart.save();
        return res.json({ message: "Cập nhật số lượng thành công" });
      } else {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  removeAllProductCart: async (req, res) => {
    const { userId } = req.params;
    const { productIds } = req.body;

    try {
      await Cart.updateOne(
        { userId },
        { $pull: { items: { product: { $in: productIds } } } }
      );
      res.status(200).json({ message: "Sản phẩm đã được xóa thành công." });
    } catch (error) {
      console.error("Lỗi xóa sản phẩm", error);
      res.status(500).json({ message: "Lỗi xóa sản phẩm" });
    }
  },
};

export default productCtrl;
