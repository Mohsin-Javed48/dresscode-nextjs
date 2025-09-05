const http = require("http");
const fs = require("fs");
const url = require("url");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Home page");
});
app.get("/about", (req, res) => {
  res.send("Hello from About Page");
});

app.listen(8000, () => {
  console.log("Server running on port 8080");
});
