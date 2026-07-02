const { USER_ROLES } = require('../utils/constants');


const checkOwnership = (model, ownerField) => async (req, res, next) => {
  try {
    // Admin bypasses ownership check entirely
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }

    const resource = await model.findById(req.params.id);

    if (!resource) {
      return next({ status: 404, message: 'Resource not found' });
    }

   
    if (resource[ownerField].toString() !== req.user.id.toString()) {
      return next({ status: 403, message: 'Forbidden: you do not own this resource' });
    }

    // Attach resource to req so the controller doesn't need to fetch it again
    req.resource = resource;
    next();

  } catch (err) {
    next(err);
  }
};

module.exports = { checkOwnership };