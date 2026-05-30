const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config({
  path: `../.env.${process.env.NODE_ENV}`
});

const app = express();

app.use(morgan());
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
