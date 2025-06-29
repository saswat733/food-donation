import express from "express";
import {
  getDonations,
  recordDonation,
  getDonors,
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
  getIncomingDonations,
  updateIncomingDonationStatus,
  getVolunteerApplications,
  updateApplicationStatus,
  getAllVolunteerRecords,
  getAllOrgVolunteerRecords,
} from "../controllers/OrganizationControllers/OrganizationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Donation routes
router.route("/donations").get(getDonations).post(recordDonation);

// Incoming donation requests from individuals
router.route("/incoming-donations").get(getIncomingDonations);

router.route("/incoming-donations/:id").patch(updateIncomingDonationStatus);

// Volunteer applications from individuals
router.route("/volunteer-applications").get(getVolunteerApplications);

router.route("/volunteer-applications/:id").patch(updateApplicationStatus);

// Donor routes
router.route("/donors").get(getDonors).post(createDonor);
router.route("/donors/:id").get(getDonor).put(updateDonor).delete(deleteDonor);
router.get("/records", getAllVolunteerRecords);;
// Volunteer routes
router.route("/volunteers").get(getAllOrgVolunteerRecords).post(addVolunteer);

// Inventory routes
router.route("/inventory").get(getInventory).post(updateInventory);

// Request routes
router.route("/requests").get(getRequests).post(createRequest);

// Event routes
router.route("/events").get(getEvents).post(createEvent);

// Stats route
router.route("/stats").get(getStats);

export default router;
