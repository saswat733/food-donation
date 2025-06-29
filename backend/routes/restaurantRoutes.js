import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createDonation, getAllOrganisations, getDonations, getDonationStats } from "../controllers/restaurantController/donationController.js";
import { cancelPickupSchedule, createPickupSchedule, getPickupSchedules } from "../controllers/restaurantController/pickupController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Donation routes
router.route("/donations").get(getDonations).post(createDonation);
router.route("/organisations").get(getAllOrganisations);
router.route("/donations/stats").get(getDonationStats);

// Pickup schedule routes
router.route("/pickups").get(getPickupSchedules).post(createPickupSchedule);

router.route("/pickups/:id").delete(cancelPickupSchedule);

export default router;
