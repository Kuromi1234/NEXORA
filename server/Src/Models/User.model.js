const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  tier: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free"
  }
}, { timestamps: true }) 

module.exports = mongoose.model('User', userSchema);