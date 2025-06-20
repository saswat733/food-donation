import FoodDonation from "../models/foodDonationModels.js";
import { sendDonationConfirmationEmail } from "../services/emailService.js";

export const createDonation = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "donorName",
      "email", // Added email to required fields
      "contactNumber",
      "foodType",
      "foodDescription",
      "quantity",
      "freshness",
      "pickupLocation",
      "pickupDate",
      "pickupTime",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate foodType enum values
    const validFoodTypes = ["prepared-food", "perishable", "non-perishable"];
    if (!validFoodTypes.includes(req.body.foodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid foodType. Must be one of: ${validFoodTypes.join(
          ", "
        )}`,
      });
    }

    // Convert quantity to number if it's a string
    if (typeof req.body.quantity === "string") {
      req.body.quantity = Number(req.body.quantity);
      if (isNaN(req.body.quantity)) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a valid number",
        });
      }
    }

    // Prepare donation data
    const donationData = {
      ...req.body,
      // Set default status if not provided
      status: req.body.status || "pending",
      // Add userId if available (from authenticated user)
      userId: req.user?.id || req.body.userId,
    };

    // Create the donation
    const donation = new FoodDonation(donationData);
    await donation.save();

    // Send confirmation email
    await sendDonationConfirmationEmail(donation);

    res.status(201).json({
      success: true,
      data: donation,
      message: "Food donation request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating food donation:", error);

    // Handle specific error types
    let errorMessage = "Error creating food donation";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      statusCode = 400;
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (error.code === 11000) {
      statusCode = 409;
      errorMessage = "Duplicate donation detected";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all food donations
export const getAllDonations = async (req, res) => {
  try {
    const { status, donorType, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (donorType) query.donorType = donorType;

    const donations = await FoodDonation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await FoodDonation.countDocuments(query);

    res.json({
      success: true,
      data: donations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching food donations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching food donations",
      error: error.message,
    });
  }
};

// Get a single donation by ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Food donation not found",
      });
    }
    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error("Error fetching food donation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching food donation",
      error: error.message,
    });
  }
};

// Update donation status
export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "scheduled", "collected", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const donation = await FoodDonation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Food donation not found",
      });
    }

    res.json({
      success: true,
      data: donation,
      message: "Donation status updated successfully",
    });
  } catch (error) {
    console.error("Error updating food donation:", error);
    res.status(500).json({
      success: false,
      message: "Error updating food donation",
      error: error.message,
    });
  }
};

// Get donations by user email
export const getUserDonations = async (req, res) => {
  try {
    const { email } = req.params;
    const donations = await FoodDonation.find({ email }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching user donations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user donations",
      error: error.message,
    });
  }
};
