// models/User.js
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["individual", "organization", "restaurant"],
      required: true,
    },
    phone: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: "role" }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

// Individual User
const Individual = User.discriminator(
  "individual",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    address: String,
  })
);

// Organization User
const Organization = User.discriminator(
  "organization",
  new mongoose.Schema({
    orgName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    missionStatement: String,
  })
);

// Restaurant User
const Restaurant = User.discriminator(
  "restaurant",
  new mongoose.Schema({
    restaurantName: {
      type: String,
      required: true,
    },
    cuisineType: String,
    licenseNumber: {
      type: String,
      required: true,
    },
    contactPerson: String,
  })
);

export { User, Individual, Organization, Restaurant };
