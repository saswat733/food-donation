import mongoose from "mongoose"

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    enum: ["prepared-food", "perishable", "non-perishable"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  freshness: {
    type: String,
    enum: ["fresh", "1day", "2day", "packaged"],
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: false, // Ensure each donation is tied to a user
  },
});

const Donations=mongoose.model("Donations",donationSchema);
export default Donations