const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./Src/config/db");
const mongoose = require("mongoose");

console.log("NODE_ENV =", process.env.NODE_ENV);

dotenv.config({
  path: path.join(
    __dirname,
    `../.env.${process.env.NODE_ENV || "development"}`
  ),
});

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

console.log("FILE:", __filename);
console.log("DIR:", __dirname);

app.get("/restraunts", (req, res) => {
  res.json({restraunts:["Pizza Hut", "Domino's", "KFC"]});
});

app.post("/bookings", (req,res)=>{
  res.json({bookings:"confirmed"})
});

app.post("/auth/login", (req,res)=>{
  res.json({token:"fake-jwt-token"});
});

app.use((err, req, res , next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "something went wrong" });
});

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Ready State:", mongoose.connection.readyState);
  });
};

startServer();
