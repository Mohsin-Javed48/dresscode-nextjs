const express = require("express");
const router = express.Router();
const {
  handleGetAllCloths,
  handleCreateCloths,
  handleGetClothsById,
} = require("../controllers/cloths");

router.route("/").get(handleGetAllCloths).post(handleCreateCloths);
router.route("/:id").get(handleGetClothsById);

module.exports = router;
