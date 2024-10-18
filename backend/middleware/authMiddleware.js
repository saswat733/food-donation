const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers (expects "Bearer <token>")
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (e.g., user ID) to the request

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification failed:', err.message); // Optional: Log the error for debugging
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
