import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Required only for individual applicants (not for manually added volunteers)
      required: function () {
        return this.source === "application";
      },
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "both", "flexible"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave"],
      default: "active",
    },
    // Track the source of the volunteer (manual add vs. application)
    source: {
      type: String,
      enum: ["manual", "application"],
      required: true,
      default: "manual",
    },
    // Reference to the application (if applicable)
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VolunteerApplication",
      required: function () {
        return this.source === "application";
      },
    },
    // Additional fields for both types
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: Date,
    notes: String, // For organization's internal notes
  },
  { timestamps: true }
);

// Indexes for faster queries
VolunteerSchema.index({ organization: 1, status: 1 });
VolunteerSchema.index({ email: 1, organization: 1 }, { unique: true });

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);
export default Volunteer;
