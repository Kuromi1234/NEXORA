// Restaurant.model.js
const mongoose = require("mongoose");
const { PAYMENT_POLICY } = require("../Utils/constants");

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
    paymentPolicy: {
      type: String,
      enum: Object.values(PAYMENT_POLICY),
      default: PAYMENT_POLICY.NONE,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);