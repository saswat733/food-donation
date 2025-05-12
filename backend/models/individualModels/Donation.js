const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodType: {
      type: String,
      enum: ["perishable", "non-perishable", "prepared", "other"],
      required: true,
    },
    foodDescription: {
      type: String,
      required: true,
    },
    quantity: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["kg", "lbs", "units", "meals"],
        required: true,
      },
    },
    storageRequirements: {
      type: String,
      enum: ["refrigerated", "frozen", "shelf-stable", "none"],
      required: true,
    },
    preferredDeliveryDate: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: ["pending", "approved", "scheduled", "delivered", "cancelled"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    scheduledDeliveryDate: Date,
    actualDeliveryDate: Date,
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    specialInstructions: String,
    images: [String], // URLs to images of the food donation
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
