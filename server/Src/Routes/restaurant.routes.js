// routes/restaurant.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../utils/constants');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurant.controller');

router.get('/', authMiddleware, requirePermission(PERMISSIONS.RESTAURANT_READ), getRestaurants);
router.get('/:id', authMiddleware, requirePermission(PERMISSIONS.RESTAURANT_READ), getRestaurantById);
router.post('/', authMiddleware, requirePermission(PERMISSIONS.RESTAURANT_MANAGE), createRestaurant);
router.patch('/:id', authMiddleware, requirePermission(PERMISSIONS.RESTAURANT_MANAGE), updateRestaurant);
router.delete('/:id', authMiddleware, requirePermission(PERMISSIONS.RESTAURANT_MANAGE), deleteRestaurant);

module.exports = router;