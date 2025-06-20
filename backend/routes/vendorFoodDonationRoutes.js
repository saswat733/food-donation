import express from "express";
import { body } from "express-validator";

import { createFoodDonation, getFoodDonations } from "../controllers/vendorFoodDonationController.js";

const router = express.Router();

// Validation rules
const donationValidationRules = [
  body("businessName").notEmpty().trim().escape(),
  body("contactName").notEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("phone").notEmpty().trim().escape(),
  body("businessType").isIn([
    "catering",
    "restaurant",
    "venue",
    "hotel",
    "bakery",
    "farm",
    "other",
  ]),
  body("address").notEmpty().trim().escape(),
  body("foodType").isIn([
    "prepared-meals",
    "fresh-produce",
    "packaged-food",
    "bakery",
    "dairy",
    "other",
  ]),
  body("quantity").notEmpty().trim().escape(),
  body("foodDetails").notEmpty().trim().escape(),
  body("pickupTime").isISO8601().toDate(),
];

// Routes
router.post("/", donationValidationRules, createFoodDonation);
router.get("/", getFoodDonations);

export default router;
