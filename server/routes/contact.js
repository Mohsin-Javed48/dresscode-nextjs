const express = require("express");
const { handleCreateContact } = require("../controllers/contact");
const router = express.Router();

router.post("/", handleCreateContact);

module.exports = router;
