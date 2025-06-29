import PickupSchedule from "../../models/restaurantModels/pickupScheduleModel.js";
import { Organization } from "../../models/userModels.js";
/**
 * Create a new pickup schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPickupSchedule = async (req, res) => {
  try {
    const {
      organization,
      frequency,
      days,
      pickupTime,
      startDate,
      endDate,
      notes,
    } = req.body;

    // Validate organization exists
    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Validate days for weekly frequency
    if (frequency === "weekly" && (!days || days.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Weekly schedule requires at least one day",
      });
    }

    const schedule = new PickupSchedule({
      restaurant: req.user.id,
      organization,
      frequency,
      days: frequency === "weekly" ? days : [],
      pickupTime,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      notes,
    });

    const savedSchedule = await schedule.save();

    return res.status(201).json({
      success: true,
      data: savedSchedule,
    });
  } catch (error) {
    console.error("Error creating pickup schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all pickup schedules for a restaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const getPickupSchedules = async (req, res) => {
  try {
    const pickups = await PickupSchedule.find({
      restaurant: req.user.id,
      isActive: true,
    })
      .populate({
        path: "organization",
        match: { role: "organization" }, // Only populate organization users
        select: "orgName registrationNumber", // Select org-specific fields
      })
      .sort({ startDate: 1 })
      .lean();

      console.log("Fetched pickup schedules:", pickups);
    // Filter out any null organizations if needed
    const validPickups = pickups.filter(
      (pickup) => pickup.organization !== null
    );

    return res.status(200).json({
      success: true,
      count: validPickups.length,
      data: validPickups,
    });
  } catch (error) {
    console.error("Error fetching pickup schedules:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
/**
 * Cancel a pickup schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cancelPickupSchedule = async (req, res) => {
  try {
    const schedule = await PickupSchedule.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("Error canceling pickup schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export { createPickupSchedule, getPickupSchedules, cancelPickupSchedule };
