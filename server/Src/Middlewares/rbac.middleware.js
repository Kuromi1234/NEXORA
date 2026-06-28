const permissions = {
  user: ['booking:create', 'booking:read:own', 'booking:cancel'],
  admin: ['booking:create', 'booking:read:any', 'booking:delete', 'restaurant:manage']
}

const requirePermission = (permission) => (req, res, next) => {
  const userPermissions = permissions[req.user.role] || []
  if (!userPermissions.includes(permission)) {
    return res.status(403).json({ error: 'Forbidden — insufficient permissions' })
  }
  next()
}

module.exports = requirePermission