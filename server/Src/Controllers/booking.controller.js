const Booking = require("../Models/Booking.model");
const Restaurant = require("../Models/Restaurant.model");
const runScraperAgent = require("../Agents/scraper.agent");

const createBooking = async (req, res, next) => {
  try {
    const { restaurantId, date, timeSlot, partySize } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant)
      return next({ status: 404, message: "Restaurant not found" });

    const booking = await Booking.create({
      userId: req.user.id,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantPhone: restaurant.phone,
      date,
      timeSlot,
      partySize,
    });

    // Kick off scraper agent (fire-and-track, not awaited blocking the response in real BullMQ setup —
    // for MVP without queue yet, we await it directly)
    const agentResult = await runScraperAgent(booking._id, restaurant.cuisine);

    booking.agentSessionId = agentResult.sessionId;
    await booking.save();

    res.status(201).json({ success: true, data: booking, agent: agentResult });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return next({ status: 404, message: "Booking not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  deleteBooking,
};
