// models/Volunteer.js
const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  city: String,
  availability: String,
  skills: String,
  motivation: String,
  date: { type: Date, default: Date.now },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
