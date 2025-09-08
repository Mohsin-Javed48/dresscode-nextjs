const url = require("url");
const express = require("express");
const app = express();
const clothsRouter = require("./routes/cloths");
const connectMongoDb = require("./connection");
const logReqRes = require("./middlewares");

connectMongoDb("mongodb://localhost:27017/dresscode").then((err) => {
  if (err) {
    console.error("ERROR WHILE CONNECT TO DATABASE", err);
  }
});

app.use(logReqRes("log.txt"));

app.use("/api/cloths", clothsRouter);
app.listen(8000, () => {
  console.log("Server running on port 8080");
});
