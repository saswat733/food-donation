import mongoose from "mongoose"
const DonorSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
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
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    donationHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    lastDonationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for organization + email to ensure unique emails per organization
DonorSchema.index({ organization: 1, email: 1 }, { unique: true });

// Virtual for total donations count
DonorSchema.virtual("totalDonations").get(function () {
  return this.donationHistory ? this.donationHistory.length : 0;
});

const Donor =mongoose.model("Donor", DonorSchema);
export default Donor;