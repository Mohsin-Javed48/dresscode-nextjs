const express = require("express");
const router = express.Router();
const {
  handleGoogleCallback,
  getUserByEmail,
  createUser,
  getUserById,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  verifyToken,
  login,
  register,
  logout,
  verifySession,
} = require("../controllers/user");

// Authentication routes
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/verify-session", verifySession);

// Google OAuth routes
router.post("/google/callback", handleGoogleCallback);

// User CRUD routes
router.get("/email/:email", getUserByEmail);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", verifyToken, updateUserProfile);
router.delete("/:id", verifyToken, deleteUser);

// Admin routes
router.get("/", verifyToken, getAllUsers);

module.exports = router;
