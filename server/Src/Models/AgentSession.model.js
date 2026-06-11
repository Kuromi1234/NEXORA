// AgentSession.model.js
const mongoose = require('mongoose')

const callAttemptSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  attemptCount: { type: Number, default: 0 },
  outcome: { type: String, enum: ['no_answer', 'confirmed', 'rejected'] }
}, { _id: false })

const agentSessionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  status: {
    type: String,
    enum: ['SEARCHING', 'CALLING', 'COMPLETED', 'FAILED'],
    default: 'SEARCHING'
  },
  scrapedRestaurants: { type: Array, default: [] },
  callAttempts: [callAttemptSchema],
  transcript: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('AgentSession', agentSessionSchema)