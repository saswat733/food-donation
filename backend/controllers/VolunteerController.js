// controllers/volunteerController.js

const Volunteer = require("../models/VolunteerModel");

const registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({ message: "Volunteer registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerVolunteer };
