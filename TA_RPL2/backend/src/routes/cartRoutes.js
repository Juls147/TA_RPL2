const express = require("express");
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.post("/", authenticateToken, cartController.addToCart);
router.get("/", authenticateToken, cartController.getCart);
router.post(
  "/updateQuantity",
  authenticateToken,
  cartController.updateCartItemQuantity
);
router.post("/remove", authenticateToken, cartController.removeFromCart);

module.exports = router;
