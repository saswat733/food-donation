const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  storageRequirements: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "received", "distributed", "expired"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.models.Donation;
module.exports = mongoose.model("Donation", DonationSchema);
