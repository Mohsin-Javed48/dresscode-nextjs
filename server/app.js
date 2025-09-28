require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const clothsRouter = require("./routes/cloths");
const connectMongoDb = require("./connection");
const logReqRes = require("./middlewares");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const contactRouter = require("./routes/contact");
const ordersRouter = require("./routes/orders");

const port = process.env.PORT || 8000;

// Use environment variable or fallback to local MongoDB
const mongoUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/dresscode";

console.log(process.env.MONGODB_URL);
connectMongoDb(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("ERROR WHILE CONNECT TO DATABASE", err);
  });

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-production-domain.com", // Add your production domain
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use(logReqRes("log.txt"));

app.use("/api/cloths", clothsRouter);
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.listen(port, () => {
  console.log("Server running on port 8000");
});
