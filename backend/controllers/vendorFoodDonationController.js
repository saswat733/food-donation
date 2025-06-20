import FoodDonation from "../models/VendorFoodDonationModel.js";
import { validationResult } from "express-validator";
import { sendFoodDonationConfirmationEmail } from "../services/emailService.js";

export const createFoodDonation = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      businessName,
      contactName,
      email,
      phone,
      businessType,
      address,
      foodType,
      quantity,
      foodDetails,
      pickupTime,
    } = req.body;

    const newDonation = await FoodDonation.create({
      businessName,
      contactName,
      email,
      phone,
      businessType,
      address,
      foodType,
      quantity,
      foodDetails,
      pickupTime: new Date(pickupTime),
      status: "pending",
    });

    // Send confirmation email
    await sendFoodDonationConfirmationEmail(newDonation);

    res.status(201).json({
      success: true,
      data: newDonation,
      message: "Food donation offer submitted successfully",
    });
  } catch (error) {
    console.error("Error creating food donation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit food donation offer",
      error: error.message,
    });
  }
};

export const getFoodDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching food donations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food donations",
      error: error.message,
    });
  }
};
