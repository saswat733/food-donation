import mongoose from "mongoose"
const volunteerApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: Date,
});

const VolunteerApplication = mongoose.model(
  "VolunteerApplication",
  volunteerApplicationSchema
);

export default VolunteerApplication;
