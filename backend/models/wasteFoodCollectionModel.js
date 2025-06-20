import mongoose from "mongoose";

const wasteCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    wasteType: {
      type: String,
      required: true,
      enum: ["vegetable", "grain", "dairy", "mixed", "other"],
      default: "vegetable",
    },
    quantity: {
      type: String,
      required: true,
      enum: ["small", "medium", "large"],
      default: "small",
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "collected", "processed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const WasteCollection = mongoose.model(
  "WasteCollection",
  wasteCollectionSchema
);

export default WasteCollection;
