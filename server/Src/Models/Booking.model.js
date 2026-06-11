// Booking.model.js
const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String, required: true },
  restaurantPhone: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['INITIATED', 'AGENT_CALLING', 'RESTAURANT_CONFIRMED', 'PAYMENT_PENDING', 'COMPLETED', 'FAILED'],
    default: 'INITIATED'
  },
  agentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentSession' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)