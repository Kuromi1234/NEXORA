// controllers/restaurant.controller.js
const Restaurant = require('../models/Restaurant.model');
const { PAYMENT_POLICY } = require('../utils/constants');

/**
 * POST /restaurants
 * Admin creates a restaurant
 */
const createRestaurant = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      cuisine,
      rating,
      openingHours,
      location,
      paymentPolicy,
      depositAmount
    } = req.body;

    // If paymentPolicy is deposit or full, depositAmount must be > 0
    if (
      (paymentPolicy === PAYMENT_POLICY.DEPOSIT || paymentPolicy === PAYMENT_POLICY.FULL) &&
      (!depositAmount || depositAmount <= 0)
    ) {
      return next({
        status: 400,
        message: 'depositAmount must be greater than 0 when paymentPolicy is deposit or full'
      });
    }

    const restaurant = await Restaurant.create({
      name,
      phone,
      address,
      cuisine,
      rating,
      openingHours,
      location,
      paymentPolicy: paymentPolicy || PAYMENT_POLICY.NONE,
      depositAmount: depositAmount || 0
    });

    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /restaurants
 * Any authenticated user fetches all restaurants
 */
const getRestaurants = async (req, res, next) => {
  try {
    const { cuisine, minRating } = req.query;

    // Build filter dynamically based on query params
    const filter = {};
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const restaurants = await Restaurant.find(filter).sort({ rating: -1 });

    res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /restaurants/:id
 * Fetch single restaurant by ID
 */
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return next({ status: 404, message: 'Restaurant not found' });

    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /restaurants/:id
 * Admin updates a restaurant
 */
const updateRestaurant = async (req, res, next) => {
  try {
    const { paymentPolicy, depositAmount } = req.body;

    // Same deposit validation on update
    if (
      (paymentPolicy === PAYMENT_POLICY.DEPOSIT || paymentPolicy === PAYMENT_POLICY.FULL) &&
      (!depositAmount || depositAmount <= 0)
    ) {
      return next({
        status: 400,
        message: 'depositAmount must be greater than 0 when paymentPolicy is deposit or full'
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!restaurant) return next({ status: 404, message: 'Restaurant not found' });

    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /restaurants/:id
 * Admin deletes a restaurant
 */
const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return next({ status: 404, message: 'Restaurant not found' });

    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};