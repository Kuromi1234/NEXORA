const { PERMISSIONS, USER_ROLES } = require('../Utils/constants');

const rolePermissions = {
  [USER_ROLES.USER]: [
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ_OWN,
    PERMISSIONS.BOOKING_CANCEL_OWN,
    PERMISSIONS.RESTAURANT_READ
  ],
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ_OWN,
    PERMISSIONS.BOOKING_READ_ANY,
    PERMISSIONS.BOOKING_DELETE,
    PERMISSIONS.BOOKING_CANCEL_OWN,
    PERMISSIONS.RESTAURANT_READ,
    PERMISSIONS.RESTAURANT_MANAGE,
    PERMISSIONS.USER_MANAGE
  ]
};

const requirePermission = (permission) => (req, res, next) => {
  const userPermissions = rolePermissions[req.user.role];

  if (!userPermissions || !userPermissions.includes(permission)) {
    return next({ status: 403, message: 'Forbidden: insufficient permission' });
  }

  next();
};

module.exports = { requirePermission, rolePermissions };