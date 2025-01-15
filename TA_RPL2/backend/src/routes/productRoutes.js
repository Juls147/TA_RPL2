const express = require("express");
const productController = require("../controllers/productController");
const authenticateToken = require("../middlewares/auth");
const upload = require("../middlewares/uploadConfig");
const router = express.Router();

router.get("/", productController.getAllProduct);
router.get("/bestsellers", productController.getBestSellers);
router.get("/category/:categoryId", productController.getProductByIdCategory);
router.get("/name/:name", productController.getProductByName);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  productController.updateProduct
);
router.delete("/:id", authenticateToken, productController.deleteProduct);

module.exports = router;
