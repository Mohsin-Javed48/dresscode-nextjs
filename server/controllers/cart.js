const Cart = require("../models/cart");

function calculateTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = items.length === 0 ? 0 : 15;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

const mongoose = require("mongoose");

async function getCart(req, res) {
  try {
    const { userId } = req.params;
    console.log("userId", userId);
    // Allow string ids (guest ids) as well as ObjectIds
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    const totals = calculateTotals(cart.items);
    return res.json({ cart, totals });
  } catch (err) {
    console.error("getCart error", err);
    return res.status(500).json({ message: "Failed to get cart" });
  }
}

async function addItem(req, res) {
  try {
    const { userId } = req.params;
    // Accept string userId
    const {
      productId,
      name,
      price,
      image,
      size,
      color,
      quantity = 1,
    } = req.body || {};
    if (!productId || !name || typeof price !== "number") {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId }, $set: { updatedAt: new Date() } },
      { new: true, upsert: true }
    );

    const idx = cart.items.findIndex(
      (i) =>
        String(i.productId) === String(productId) &&
        i.size === size &&
        i.color === color
    );
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, size, color, quantity });
    }
    await cart.save();
    const totals = calculateTotals(cart.items);
    return res.status(201).json({ cart, totals });
  } catch (err) {
    console.error("addItem error", err);
    return res.status(500).json({ message: "Failed to add item" });
  }
}

async function updateQuantity(req, res) {
  try {
    const { userId, productId } = req.params;
    // Accept string userId
    const { size, color, quantity } = req.body || {};
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.items.find(
      (i) =>
        String(i.productId) === String(productId) &&
        i.size === size &&
        i.color === color
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    console.log("quantity", quantity);
    item.quantity = quantity;
    await cart.save();
    const totals = calculateTotals(cart.items);
    return res.json({ cart, totals });
  } catch (err) {
    console.error("updateQuantity error", err);
    return res.status(500).json({ message: "Failed to update quantity" });
  }
}

async function removeItem(req, res) {
  try {
    const { userId, productId } = req.params;
    const { size, color } = req.body || {};
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(
      (i) =>
        !(
          String(i.productId) === String(productId) &&
          i.size === size &&
          i.color === color
        )
    );
    await cart.save();
    const totals = calculateTotals(cart.items);
    return res.json({ cart, totals });
  } catch (err) {
    console.error("removeItem error", err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
}

async function clearCart(req, res) {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = [];
    await cart.save();
    const totals = calculateTotals(cart.items);
    return res.json({ cart, totals });
  } catch (err) {
    console.error("clearCart error", err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
}

module.exports = { getCart, addItem, updateQuantity, removeItem, clearCart };
