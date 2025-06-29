import mongoose from "mongoose"

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Changed from "Organization" to "User" since both are in User model
      // required: true,
    },
    foodType: {
      type: String,
      enum: ["perishable", "non-perishable", "prepared", "other"],
      required: true, // Uncommented required
    },
    foodDescription: {
      type: String,
      required: true, // Uncommented required
    },
    quantity: {
      value: {
        type: Number,
        required: true, // Uncommented required
      },
      unit: {
        type: String,
        enum: ["kg", "lbs", "units", "meals"],
        required: true, // Uncommented required
      },
    },
    storageRequirements: {
      type: String,
      enum: ["refrigerated", "frozen", "shelf-stable", "none"],
      required: true, // Uncommented required
    },
    preferredDeliveryDate: {
      type: Date,
      required: true, // Uncommented required
    },
    purpose: {
      type: String,
      required: true, // Uncommented required
    },
    specialInstructions: String,
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
    applicationSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgDonation", 
    },
    images: [String],
  },
  {
    timestamps: true,
  }
);


const Donation = mongoose.model("Donation", donationSchema);
export default Donation;