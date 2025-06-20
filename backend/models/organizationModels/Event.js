import mongoose from "mongoose"
const EventSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  volunteersNeeded: {
    type: Number,
    required: true,
  },
  volunteersAssigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
});

const Event= mongoose.model("Event", EventSchema);
export default Event