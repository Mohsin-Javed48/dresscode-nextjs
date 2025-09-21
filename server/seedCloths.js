const mongoose = require("mongoose");
const Cloths = require("./models/cloths");
const connectMongoDb = require("./connection");

// Cloth data with suitable names and three categories
const clothsData = [
  // NEW ARRIVALS CATEGORY (6 items)
  {
    name: "Classic Black Graphic Tee",
    rating: 4.2,
    reviews: "Great quality cotton tee with stylish graphic design",
    price: 29.99,
    category: "newArrival",
    style: "Casual",
    discount: 10,
    image: "/cloths/705-black-shirt.jpg",
    size: "L",
    season: "All",
    stockAvailable: 25,
    description:
      "Comfortable black t-shirt with unique graphic design. Perfect for casual wear.",
    gender: "Men",
  },
  {
    name: "Light Blue Casual Shirt",
    rating: 4.5,
    reviews: "Perfect fit and comfortable fabric",
    price: 45.99,
    category: "newArrival",
    style: "Smart Casual",
    discount: 15,
    image: "/cloths/blue-baby-boy-shirt.jpg",
    size: "M",
    season: "Spring",
    stockAvailable: 18,
    description:
      "Light blue casual shirt perfect for office or casual outings.",
    gender: "Men",
  },
  {
    name: "Men's Classic Navy Pullover Sweater",
    rating: 4.8,
    reviews: "Excellent quality wool blend, very comfortable",
    price: 89.99,
    category: "newArrival",
    style: "Smart Casual",
    discount: 25,
    image: "/cloths/navy-pullover-sweater.jpg",
    size: "L",
    season: "Winter",
    stockAvailable: 14,
    description:
      "Classic navy pullover sweater with crew neckline. Made from premium cotton blend for comfort and durability.",
    gender: "Men",
  },
  {
    name: "Women's Light Wash Denim Jacket",
    rating: 4.6,
    reviews: "Perfect fit and great quality denim",
    price: 75.99,
    category: "newArrival",
    style: "Casual",
    discount: 18,
    image: "/cloths/light-denim-jacket.jpg",
    size: "M",
    season: "Spring",
    stockAvailable: 11,
    description:
      "Light wash denim jacket with classic button closure. Perfect for layering over any outfit.",
    gender: "Women",
  },
  {
    name: "Elegant Pink Evening Dress",
    rating: 4.9,
    reviews: "Beautiful dress, perfect for special occasions",
    price: 95.99,
    category: "newArrival",
    style: "Party",
    discount: 22,
    image: "/cloths/pink-frock.jpg",
    size: "S",
    season: "Spring",
    stockAvailable: 10,
    description:
      "Elegant pink dress perfect for parties, weddings, and special occasions.",
    gender: "Women",
  },
  {
    name: "Pure Black Essential Tee",
    rating: 4.0,
    reviews: "Simple and comfortable, good value",
    price: 24.99,
    category: "newArrival",
    style: "Gym",
    discount: 0,
    image: "/cloths/pure-black-tshirt.jpg",
    size: "M",
    season: "All",
    stockAvailable: 35,
    description:
      "Basic black t-shirt made from comfortable cotton. Essential for any wardrobe.",
    gender: "Men",
  },

  // TOP SELLING CATEGORY (5 items)
  {
    name: "Blue Hoodie with Cap",
    rating: 4.7,
    reviews: "Warm and stylish hoodie, great for winter",
    price: 65.99,
    category: "topSelling",
    style: "Gym",
    discount: 20,
    image: "/cloths/blue-hoodie-with-cap.jpg",
    size: "XL",
    season: "Winter",
    stockAvailable: 12,
    description:
      "Cozy blue hoodie with attached cap. Perfect for cold weather and casual wear.",
    gender: "Unisex",
  },
  {
    name: "Navy Blazer with Skirt Set",
    rating: 4.8,
    reviews: "Elegant set, perfect for professional settings",
    price: 125.99,
    category: "topSelling",
    style: "Formal",
    discount: 25,
    image: "/cloths/blue-with-skirt.jpg",
    size: "S",
    season: "All",
    stockAvailable: 8,
    description:
      "Professional navy blazer and skirt set. Perfect for business meetings and formal events.",
    gender: "Women",
  },
  {
    name: "Brown Casual Hoodie",
    rating: 4.3,
    reviews: "Comfortable and warm, great color",
    price: 58.99,
    category: "topSelling",
    style: "Casual",
    discount: 12,
    image: "/cloths/brown-hoodie.jpg",
    size: "L",
    season: "Autumn",
    stockAvailable: 15,
    description:
      "Soft brown hoodie perfect for casual wear and cooler weather.",
    gender: "Unisex",
  },
  {
    name: "Premium Black T-Shirt",
    rating: 4.6,
    reviews: "High quality fabric, comfortable fit",
    price: 39.99,
    category: "topSelling",
    style: "Party",
    discount: 8,
    image: "/cloths/full-black-tshirt.jpg",
    size: "L",
    season: "All",
    stockAvailable: 30,
    description:
      "Premium quality black t-shirt made from soft cotton blend. A wardrobe essential.",
    gender: "Men",
  },
  {
    name: "Denim Jeans Outfit",
    rating: 4.4,
    reviews: "Stylish denim combination, trendy look",
    price: 89.99,
    category: "topSelling",
    style: "Casual",
    discount: 18,
    image: "/cloths/jeans-pents-outfit.jpg",
    size: "M",
    season: "All",
    stockAvailable: 14,
    description:
      "Complete denim outfit with jeans and matching top. Perfect for casual outings.",
    gender: "Women",
  },

  // TRENDING NOW CATEGORY (5 items)
  {
    name: "Cream Original Graphic T-Shirt",
    rating: 4.1,
    reviews: "Cool graphic design, comfortable fit",
    price: 32.99,
    category: "trendingNow",
    style: "Casual",
    discount: 5,
    image: "/cloths/blue-white-tshirt.jpg",
    size: "M",
    season: "Summer",
    stockAvailable: 22,
    description:
      "Trendy blue and white striped t-shirt for a fresh casual look.",
    gender: "Men",
  },
  {
    name: "Vibrant Tie-Dye Spiral T-Shirt",
    rating: 4.7,
    reviews: "Amazing colors, eye-catching design",
    price: 69.99,
    category: "trendingNow",
    style: "Streetwear",
    discount: 15,
    image: "/cloths/white-polo-shirt.jpg",
    size: "L",
    season: "Summer",
    stockAvailable: 16,
    description:
      "Premium white polo shirt with collar and button placket. Made from breathable cotton for all-day comfort.",
    gender: "Men",
  },
  {
    name: "Military Green Basic T-Shirt",
    rating: 4.5,
    reviews: "Perfect color, great quality fabric",
    price: 49.99,
    category: "trendingNow",
    style: "Casual",
    discount: 20,
    image: "/cloths/gray-henley-shirt.jpg",
    size: "M",
    season: "All",
    stockAvailable: 19,
    description:
      "Comfortable gray henley with long sleeves and button placket. Perfect for casual everyday wear.",
    gender: "Men",
  },
  {
    name: "Gray Vintage Distressed T-Shirt",
    rating: 4.8,
    reviews: "Love the vintage look, great texture",
    price: 55.99,
    category: "trendingNow",
    style: "Streetwear",
    discount: 10,
    image: "/cloths/white-button-shirt.jpg",
    size: "L",
    season: "All",
    stockAvailable: 13,
    description:
      "Classic white button-down shirt. Essential for professional and formal occasions.",
    gender: "Men",
  },
  {
    name: "Blue Tropical Palm Tree T-Shirt",
    rating: 4.4,
    reviews: "Love the tropical vibes, great summer shirt",
    price: 72.99,
    category: "trendingNow",
    style: "Casual",
    discount: 30,
    image: "/cloths/black-graphic-hoodie.jpg",
    size: "XL",
    season: "Summer",
    stockAvailable: 9,
    description:
      "Blue t-shirt with tropical palm tree design. Perfect for summer vibes and casual wear.",
    gender: "Unisex",
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectMongoDb("mongodb://localhost:27017/dresscode");
    console.log("Connected to MongoDB successfully");

    // Clear existing cloths (optional - remove this if you want to keep existing data)
    await Cloths.deleteMany({});
    console.log("Cleared existing cloths data");

    // Insert new cloths data
    const insertedCloths = await Cloths.insertMany(clothsData);
    console.log(
      `Successfully inserted ${insertedCloths.length} cloths into the database`
    );

    // Display inserted cloths by category
    console.log("\n=== INSERTED CLOTHS BY CATEGORY ===");

    const newArrivals = insertedCloths.filter(
      (c) => c.category === "newArrival"
    );
    console.log(`\nNEW ARRIVALS (${newArrivals.length} items):`);
    newArrivals.forEach((cloth, index) => {
      console.log(`${index + 1}. ${cloth.name} - $${cloth.price}`);
    });

    const topSelling = insertedCloths.filter(
      (c) => c.category === "topSelling"
    );
    console.log(`\nTOP SELLING (${topSelling.length} items):`);
    topSelling.forEach((cloth, index) => {
      console.log(`${index + 1}. ${cloth.name} - $${cloth.price}`);
    });

    const trendingNow = insertedCloths.filter(
      (c) => c.category === "trendingNow"
    );
    console.log(`\nTRENDING NOW (${trendingNow.length} items):`);
    trendingNow.forEach((cloth, index) => {
      console.log(`${index + 1}. ${cloth.name} - $${cloth.price}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log(
      "\nDatabase connection closed. Seeding completed successfully!"
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
