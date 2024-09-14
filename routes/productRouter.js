// backend/routes/products.js
import express from "express";
import productCtrl from "../controllers/productCtrl.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();
//admin
router.get("/get-products", productCtrl.getProduct);
router.post(
  "/create-products",
  authorize(["admin"]),
  productCtrl.createProduct
);
router.delete(
  "/delete-products/:id",
  authorize(["admin"]),
  productCtrl.deleteProduct
);
router.post(
  "/change-product-status/:product_id",
  authorize(["admin"]),
  productCtrl.changeSatusProduct
);

// user
router.get("/get-products-user", productCtrl.getProductUser);
router.get(
  "/get-product-of-one/:productId/:productName",
  productCtrl.getProductByIdAndName
);
router.get("/search-products", productCtrl.searchProducts);

// Lực thêm test
router.post("/add-to-cart", productCtrl.AddProductsCart);
router.delete(
  "/remove-product-cart/:userId/:productId",
  productCtrl.removeProductFromCart
);
router.get("/get-cart/:userId", productCtrl.GetCart);
router.put(
  "/update-cart-quantity/:userId/:productId",
  productCtrl.updateProductCart
);
router.delete(
  "/remove-all-products-cart/:userId",
  productCtrl.removeAllProductCart
);

export default router;
// ,authorize(['admin'])
