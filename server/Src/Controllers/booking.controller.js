const Booking = require('../models/Booking.model');
const AgentSession = require('../models/AgentSession.model');
const { parseIntent } = require('../services/intent.service');
const { runScraperAgent } = require('../agents/scraper.agent');
const { BOOKING_STATUS, AGENT_SESSION_STATUS } = require('../utils/constants');

/**
 * POST /bookings/intent
 * Flow A — agent-driven booking
 * Takes raw natural language, parses intent via Claude API,
 * creates booking, kicks off scraper agent
 */
const createBookingIntent = async (req, res, next) => {
  try {
    const { rawText, location } = req.body;

    if (!rawText) {
      return next({ status: 400, message: 'rawText is required' });
    }

    if (!location?.lat || !location?.lng) {
      return next({ status: 400, message: 'location.lat and location.lng are required' });
    }

    // Step 1 — Parse natural language into structured intent via Claude API
    const intent = await parseIntent(rawText);

    // Step 2 — Create booking with parsed intent fields
    // restaurantId/Name/Phone are null — agent populates these after confirmation
    const booking = await Booking.create({
      userId: req.user.id,
      cuisine: intent.cuisine,
      date: intent.date,
      timeSlot: intent.timeSlot,
      partySize: intent.partySize,
      budget: intent.budget || null,
      mood: intent.mood || null,
      location: {
        lat: location.lat,
        lng: location.lng
      },
      status: BOOKING_STATUS.INITIATED
    });

    // Step 3 — Create AgentSession tied to this booking
    const session = await AgentSession.create({
      bookingId: booking._id,
      status: AGENT_SESSION_STATUS.SEARCHING
    });

    // Step 4 — Link session back to booking
    booking.agentSessionId = session._id;
    booking.status = BOOKING_STATUS.AGENT_SEARCHING;
    await booking.save();

    // Step 5 — Respond to client immediately
    // Scraper runs after response — client gets real-time updates via WebSocket
    res.status(201).json({
      success: true,
      message: 'Booking intent received. Agent is searching for restaurants.',
      data: {
        bookingId: booking._id,
        sessionId: session._id,
        status: booking.status,
        intent: {
          cuisine: intent.cuisine,
          date: intent.date,
          timeSlot: intent.timeSlot,
          partySize: intent.partySize,
          budget: intent.budget,
          mood: intent.mood
        }
      }
    });

    // Step 6 — Kick off scraper agent AFTER response
    // This is fire-and-continue — client tracks progress via WebSocket
    // BullMQ will sit here at Level 2
    runScraperAgent(booking._id, session._id, intent).catch((err) => {
      console.error(`Scraper agent failed for booking ${booking._id}:`, err.message);
    });

  } catch (err) {
    next(err);
  }
};

/**
 * GET /bookings/me
 * User fetches their own bookings
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /bookings
 * Admin fetches all bookings
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /bookings/:id
 * Fetch single booking — controller uses req.resource
 * already fetched and ownership-verified by ABAC middleware
 */
const getBookingById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.resource });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /bookings/:id/cancel
 * User cancels their own booking — status change only, no hard delete
 * req.resource already fetched by ABAC middleware
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = req.resource;

    const nonCancellableStatuses = [
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.FAILED,
      BOOKING_STATUS.CANCELLED
    ];

    if (nonCancellableStatuses.includes(booking.status)) {
      return next({
        status: 400,
        message: `Booking cannot be cancelled when status is ${booking.status}`
      });
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /bookings/:id
 * Admin hard deletes a booking
 * req.resource already fetched by ABAC middleware
 */
const deleteBooking = async (req, res, next) => {
  try {
    await req.resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBookingIntent,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  deleteBooking
};