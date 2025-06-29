import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  updateMe,
} from "../controllers/authController.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

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
  validateRegistration, // Validation middleware
  register
);

router.post(
  "/login",
  authLimiter,
  validateLogin, // Add login validation
  login
);

router.patch("/update", protect, updateMe);

// Protected routes (require authentication)
router.get(
  "/me",
  protect, // Authentication middleware
  getMe
);

router.post(
  "/logout",
  protect, // Authentication middleware
  logout
);

export default router;
