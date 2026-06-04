const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

console.log("NODE_ENV =", process.env.NODE_ENV);

dotenv.config({
  path: path.join(
    __dirname,
    `../.env.${process.env.NODE_ENV || "development"}`
  ),
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/restruant", (req, res) => {
  res.json({restruant:["Pizza Hut", "Domino's", "KFC"]});
});

app.post("/bookings", (req,res)=>{
  res.json({bookings:"confimed"})
});

app.post("/auth/login", (req,res)=>{
  res.json({token:generatedToken});
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});