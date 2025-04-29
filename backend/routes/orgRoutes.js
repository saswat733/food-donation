const express = require("express");
const {
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
} = require("../controllers/OrganizationControllers/OrganizationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Re-route into other resource routers

// Protect all routes
router.use(protect);

// Donation routes
router.route("/donations").get(getDonations).post(recordDonation);

// Donor routes
router.route("/donors").get(getDonors).post(createDonor);

// Volunteer routes
router.route("/volunteers").get(getVolunteers).post(addVolunteer);
router.route("/donors/:id").get(getDonor).put(updateDonor).delete(deleteDonor);


// Inventory routes
router.route("/inventory").get(getInventory).post(updateInventory);

// Request routes
router.route("/requests").get(getRequests).post(createRequest);

// Event routes
router.route("/events").get(getEvents).post(createEvent);

// Stats route
router.route("/stats").get(getStats);

module.exports = router;
