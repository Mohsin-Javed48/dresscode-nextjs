const express = require("express");
const {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cart");

const router = express.Router();

// GET /api/cart/:userId
router.get("/:userId", getCart);

// POST /api/cart/:userId/items
router.post("/:userId/items", addItem);

// PATCH /api/cart/:userId/items/:productId
router.patch("/:userId/items/:productId", updateQuantity);

// DELETE /api/cart/:userId/items/:productId
router.delete("/:userId/items/:productId", removeItem);

// DELETE /api/cart/:userId
router.delete("/:userId", clearCart);

module.exports = router;
