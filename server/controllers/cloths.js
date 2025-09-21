const Cloths = require("../models/cloths");

async function handleGetAllCloths(req, res) {
  try {
    const allCloths = await Cloths.find({});
    return res.json(allCloths);
  } catch (error) {
    console.error("Error fetching cloths:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Create new cloth
async function handleCreateCloths(req, res) {
  try {
    const body = req.body;

    // Validate required fields
    if (
      !body.name ||
      !body.price ||
      !body.category ||
      !body.size ||
      !body.gender ||
      !body.image
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new cloth in MongoDB
    const cloth = await Cloths.create({
      name: body.name,
      rating: body.rating || 0,
      reviews: body.reviews || "",
      price: body.price,
      category: body.category,
      style: body.style,
      discount: body.discount || 0,
      image: body.image,
      size: body.size,
      season: body.season || "All",
      stockAvailable: body.stockAvailable || 0,
      description: body.description,
      gender: body.gender,
    });

    return res.status(201).json({
      message: "Cloth created successfully",
      cloth,
    });
  } catch (error) {
    console.error("Error creating cloth:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetClothsById(req, res) {
  try {
    const cloth = await Cloths.findById(req.params.id);
    if (!cloth) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(cloth);
  } catch (error) {
    console.error("Error fetching cloth by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleGetAllCloths,
  handleCreateCloths,
  handleGetClothsById,
};
