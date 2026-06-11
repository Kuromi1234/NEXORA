// Restaurant.model.js
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    openingHours: { type: Object },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
