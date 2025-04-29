const express = require("express");
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware"); // Add this

const rateLimit = require("express-rate-limit");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: "Too many requests from this IP, please try again later",
});

// Public routes
router.post(
  "/register",
  authLimiter,
  validateRequest.validateRegistration, // Validation middleware
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validateRequest.validateLogin, // Add login validation
  authController.login
);

// Protected routes (require authentication)
router.get(
  "/me",
  authMiddleware.protect, // Authentication middleware
  authController.getMe
);

router.post(
  "/logout",
  authMiddleware.protect, // Authentication middleware
  authController.logout
);


module.exports = router;
