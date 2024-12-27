const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log('No user found with this id');
        return res.status(404).json({ message: 'No user found with this id' });
      }
      req.userId = decoded.id;
      console.log('User authenticated, ID:', req.userId);
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'User role is not authorized to access this route' });
    }
    next();
  };
};