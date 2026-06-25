const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/auth.middleware');
const { requirePermission } = require('../Middlewares/rbac.middleware');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  deleteRestaurant
} = require('../Controllers/restaurant.controller');

router.get('/', authMiddleware, requirePermission('restaurant:read'), getRestaurants);
router.get('/:id', authMiddleware, requirePermission('restaurant:read'), getRestaurantById);
router.post('/', authMiddleware, requirePermission('restaurant:manage'), createRestaurant);
router.delete('/:id', authMiddleware, requirePermission('restaurant:manage'), deleteRestaurant);

module.exports = router;