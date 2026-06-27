const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth.middleware");
const requirePermission = require("../Middlewares/rbac.middleware");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  deleteBooking,
} = require("../Controllers/booking.controller");

router.post(
  "/",
  authMiddleware,
  requirePermission("booking:create"),
  createBooking,
);
router.get(
  "/me",
  authMiddleware,
  requirePermission("booking:read:own"),
  getMyBookings,
);
router.get(
  "/",
  authMiddleware,
  requirePermission("booking:read:any"),
  getAllBookings,
);
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("booking:delete"),
  deleteBooking,
);

module.exports = router;
