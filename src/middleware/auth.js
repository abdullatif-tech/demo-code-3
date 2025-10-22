const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header and verifies it
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication token is required'
        }
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_USER',
          message: 'User no longer exists or is inactive'
        }
      });
    }
    
    // Add user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      department: user.department
    };
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Middleware to authorize based on user roles
 * Usage: authorizeRoles('admin', 'accountant')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Please authenticate first'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `This action requires one of these roles: ${roles.join(', ')}`,
          requiredRoles: roles,
          currentRole: req.user.role
        }
      });
    }
    
    next();
  };
};

/**
 * Middleware to check resource ownership
 * Allows admins to access everything, others only their own resources
 */
const checkResourceOwnership = (resourceUserField = 'createdBy') => {
  return (req, res, next) => {
    // Admins can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // For others, mark that ownership check is needed
    // The actual check will be done in the route handler
    req.checkOwnership = true;
    req.resourceUserField = resourceUserField;
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkResourceOwnership
};
