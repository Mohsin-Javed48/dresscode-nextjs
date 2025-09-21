const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const clothsRouter = require("./routes/cloths");
const connectMongoDb = require("./connection");
const logReqRes = require("./middlewares");
const userRouter = require("./routes/user");

connectMongoDb("mongodb://localhost:27017/dresscode")
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("ERROR WHILE CONNECT TO DATABASE", err);
  });

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
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
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
