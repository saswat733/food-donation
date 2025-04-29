const express = require("express");
const dashboardController = require("../controllers/IndividualControllers/individualControllers");
// const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Add this
const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Dashboard stats
router.get("/stats", dashboardController.getDashboardStats);

// Organizations
router.get("/organizations", dashboardController.getOrganizations);

// Volunteer applications
router.post("/volunteer", dashboardController.submitVolunteerApplication);

// Service offers
router.post("/service", dashboardController.submitServiceOffer);

// Donations
router.post("/donation", dashboardController.requestDonation);
router.get("/donations", dashboardController.getDonations);
router.get("/donations-requests", dashboardController.getDonationRequests);

router.get("/donors", dashboardController.getDonors);

module.exports = router;
