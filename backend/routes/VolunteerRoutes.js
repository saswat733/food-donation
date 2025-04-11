// routes/volunteerRoutes.js
const express = require("express");
const { registerVolunteer } = require("../controllers/VolunteerController");
const router = express.Router();

router.post("/register", registerVolunteer);

module.exports = router;
