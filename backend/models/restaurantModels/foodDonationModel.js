import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodType: {
    type: String,
    enum: [
      "prepared",
      "perishable",
      "non-perishable",
      "produce",
      "dairy",
      "meat",
      "baked",
    ],
    required: true,
  },
  foodDescription: {
    type: String,
    required: true,
  },
  quantity: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["kg", "lbs", "liters", "gallons", "units", "trays"],
      required: true,
    },
  },
  mealCount: {
    type: Number,
    default: null,
  },
  storageRequirements: {
    type: String,
    enum: ["refrigerated", "frozen", "room-temperature"],
    required: true,
  },
  estimatedShelfLife: {
    type: Number, // in hours
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dietaryRestrictions: {
    type: String,
    default: "",
  },
  specialInstructions: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "scheduled", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
