const express = require("express");
const router = express.Router();

const {
  handleRegister,
  handleLogin,
  handleLogout,
  handleVerifySession,
} = require("../controllers/user");
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/verify-session", handleVerifySession);
module.exports = router;
