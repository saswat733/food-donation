const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  availability: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "on_leave"],
    default: "active",
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
