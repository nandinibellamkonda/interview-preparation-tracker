const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Robust auth middleware without debug logging
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization || null;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    // Accept formats: 'Bearer <token>' or bare token
    let token = authHeader;
    if (typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        token = parts[1].trim();
      } else {
        token = authHeader.trim();
      }
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId || decoded.user || decoded.id || null;
    if (!userId) return res.status(401).json({ message: 'Invalid token' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;