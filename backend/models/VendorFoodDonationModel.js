import mongoose from "mongoose";

const foodDonationSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, "Business name is required"],
    trim: true,
  },
  contactName: {
    type: String,
    required: [true, "Contact name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  businessType: {
    type: String,
    required: [true, "Business type is required"],
    enum: [
      "catering",
      "restaurant",
      "venue",
      "hotel",
      "bakery",
      "farm",
      "other",
    ],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  foodType: {
    type: String,
    required: [true, "Food type is required"],
    enum: [
      "prepared-meals",
      "fresh-produce",
      "packaged-food",
      "bakery",
      "dairy",
      "other",
    ],
  },
  quantity: {
    type: String,
    required: [true, "Quantity is required"],
    trim: true,
  },
  foodDetails: {
    type: String,
    required: [true, "Food details are required"],
    trim: true,
  },
  pickupTime: {
    type: Date,
    required: [true, "Pickup time is required"],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "scheduled", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema);

export default FoodDonation;
