const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
