import express from "express";
import {
  getDonations,
  recordDonation,
  getDonors,
  getVolunteers,
  addVolunteer,
  getInventory,
  updateInventory,
  getRequests,
  createRequest,
  getEvents,
  createEvent,
  getStats,
  createDonor,
  updateDonor,
  deleteDonor,
  getDonor,
} from "../controllers/OrganizationControllers/OrganizationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Donation routes
router.route("/donations").get(getDonations).post(recordDonation);

// Donor routes
router.route("/donors").get(getDonors).post(createDonor);

router.route("/donors/:id").get(getDonor).put(updateDonor).delete(deleteDonor);

// Volunteer routes
router.route("/volunteers").get(getVolunteers).post(addVolunteer);

// Inventory routes
router.route("/inventory").get(getInventory).post(updateInventory);

// Request routes
router.route("/requests").get(getRequests).post(createRequest);

// Event routes
router.route("/events").get(getEvents).post(createEvent);

// Stats route
router.route("/stats").get(getStats);

export default router;
