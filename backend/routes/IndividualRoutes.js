import express from "express";
// import dashboardController from "../controllers/IndividualControllers/individualControllers";
// const authController = require("../controllers/authController");
import { protect } from "../middleware/authMiddleware.js"; // Add this
import { getDashboardStats, getDonationRequests, getDonations, getDonors, getOrganizations, requestDonation, submitServiceOffer, submitVolunteerApplication } from "../controllers/IndividualControllers/individualControllers.js";
const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Organizations
router.get("/organizations", getOrganizations);

// Volunteer applications
router.post("/volunteer", submitVolunteerApplication);

// Service offers
router.post("/service", submitServiceOffer);

// Donations
router.post("/donation", requestDonation);
router.get("/donations", getDonations);
router.get("/donations-requests", getDonationRequests);

router.get("/donors", getDonors);

export default router
