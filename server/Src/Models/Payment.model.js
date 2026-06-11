// Payment.model.js
const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  idempotencyKey: { type: String, required: true, unique: true },
  gatewayTransactionId: { type: String, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)