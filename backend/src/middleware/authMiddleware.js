const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

/**
 * Middleware to verify JWT token and authenticate the user.
 */
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, authorization denied.',
      statusCode: 401
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '1h' });
    res.setHeader('Authorization', `Bearer ${newToken}`);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      statusCode: 401
    });
  }
};

module.exports = authenticate;
