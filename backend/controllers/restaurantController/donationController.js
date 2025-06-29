import Donation from "../../models/restaurantModels/foodDonationModel.js";
import {Organization} from "../../models/userModels.js";

const createDonation = async (req, res) => {
  try {
    const {
      organization,
      foodType,
      foodDescription,
      quantity,
      storageRequirements,
      pickupDate,
      specialInstructions,
      estimatedShelfLife,
      mealCount,
      dietaryRestrictions,
    } = req.body;

    // Validate organization exists
    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
      });
    }
    

    const donation = new Donation({
      restaurant: req.user.id,
      organization,
      foodType,
      foodDescription,
      quantity: {
        value: Number(quantity.value),
        unit: quantity.unit,
      },
      storageRequirements,
      pickupDate: new Date(pickupDate),
      specialInstructions,
      estimatedShelfLife: Number(estimatedShelfLife),
      mealCount: mealCount ? Number(mealCount) : null,
      dietaryRestrictions,
    });

    const savedDonation = await donation.save();

    return res.status(201).json({
      success: true,
      data: savedDonation,
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all donations for a restaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ restaurant: req.user.id })
      .populate({
        path: "organization",
        match: { role: "organization" }, // Only populate organization users
        select: "orgName missionStatement", // Select org-specific fields
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get donation statistics for dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDonationStats = async (req, res) => {
  try {
    const donations = await Donation.find({ restaurant: req.user.id }).lean();
    const totalDonations = donations.length;
    const mealsDonated = donations.reduce(
      (sum, donation) => sum + (donation.mealCount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalDonations,
        mealsDonated,
      },
    });
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAllOrganisations = async (req, res) => {
  try {
    const organizations = await Organization.find({ role: "organization" })
      .select("orgName registrationNumber")
      .lean();

    return res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Named exports
export { createDonation, getDonations, getDonationStats, getAllOrganisations };
