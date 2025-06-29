import mongoose from "mongoose"


const volunteerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: { type: [String], required: true },
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "both", "flexible"],
      required: true,
    },
    motivation: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },
    processedAt: Date,
    // Reference to the created Volunteer (if approved)
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  },
  { timestamps: true }
);
// Add indexes for faster queries
volunteerApplicationSchema.index({ organization: 1, status: 1 });

const VolunteerApplication = mongoose.model(
  "VolunteerApplication",
  volunteerApplicationSchema
);

export default VolunteerApplication;
