const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema({
  donorType: {
    type: String,
    enum: ["individual", "business"],
    required: true,
    default: "individual",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    trim: true,
  },
  foodType: {
    type: String,
    enum: ["prepared", "perishable", "nonPerishable"],
    required: true,
    default: "prepared",
  },
  foodDescription: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true,
    default: "small",
  },
  packaging: {
    type: String,
    enum: ["containers", "packaged", "bulk", "other"],
    required: true,
    default: "containers",
  },
  preparationTime: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String,
    enum: ["morning", "afternoon", "evening", ""],
    required: true,
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "scheduled", "collected", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
foodDonationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add validation for preparationTime when foodType is prepared
foodDonationSchema.pre("validate", function (next) {
  if (this.foodType === "prepared" && !this.preparationTime) {
    this.invalidate(
      "preparationTime",
      "Preparation time is required for prepared food"
    );
  }
  if (this.foodType !== "prepared" && !this.expiryDate) {
    this.invalidate(
      "expiryDate",
      "Expiry date is required for non-prepared food"
    );
  }
  next();
});

const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema);

module.exports = FoodDonation;
