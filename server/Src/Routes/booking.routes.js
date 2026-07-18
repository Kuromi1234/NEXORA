// routes/booking.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { checkOwnership } = require('../middleware/abac.middleware');
const Booking = require('../models/Booking.model');
const { PERMISSIONS } = require('../utils/constants');
const {
  createBookingIntent,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  deleteBooking
} = require('../controllers/booking.controller');

// Flow A — agent-driven booking intent
router.post(
  '/intent',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_CREATE),
  createBookingIntent
);

// User fetches their own bookings
router.get(
  '/me',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_READ_OWN),
  getMyBookings
);

// Admin fetches all bookings
router.get(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_READ_ANY),
  getAllBookings
);

// Fetch single booking — ABAC verifies ownership
router.get(
  '/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_READ_OWN),
  checkOwnership(Booking, 'userId'),
  getBookingById
);

// User cancels their own booking — ABAC verifies ownership
router.patch(
  '/:id/cancel',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_CANCEL_OWN),
  checkOwnership(Booking, 'userId'),
  cancelBooking
);

// Admin hard deletes a booking
router.delete(
  '/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.BOOKING_DELETE),
  deleteBooking
);

module.exports = router;