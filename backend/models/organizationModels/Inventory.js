import mongoose from "mongoose"
const InventorySchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  foodItem: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "g", "lbs", "units"],
    default: "kg",
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  storageLocation: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory