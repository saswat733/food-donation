import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
// import Organization from "../../models/userModels/Organization.js";
import VolunteerApplication from "../../models/individualModels/VolunteerApplication.js";
// import ServiceOffer from "../../models/individualModels/ServiceOffer.js";
// import Donation from "../../models/individualModels/Donation.js";
import { Organization } from "../../models/userModels.js";
import Donation from "../../models/individualModels/Donation.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalDonations = await Donation.countDocuments({
      recipient: new mongoose.Types.ObjectId(userId),
      status: "delivered",
    });

    const activeVolunteers = await VolunteerApplication.countDocuments({
      user: userId,
      status: "approved",
    });

    const serviceRequests = await ServiceOffer.countDocuments({
      user: userId,
      status: "active",
    });

    const upcomingEvents = 0;

    res.status(200).json({
      status: "success",
      data: {
        totalDonations,
        activeVolunteers,
        serviceRequests,
        upcomingEvents,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get dashboard stats", 500));
  }
};

export const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find().select("orgName category");

    res.status(200).json({
      status: "success",
      results: organizations.length,
      data: {
        organizations,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get organizations", 500));
  }
};

export const submitVolunteerApplication = async (req, res, next) => {
  try {
    const { organization, skills, availability, motivation } = req.body;

    if (!organization || !skills || !availability || !motivation) {
      return next(new AppError("All fields are required", 400));
    }

    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
      return next(new AppError("Organization not found", 404));
    }

    const existingApplication = await VolunteerApplication.findOne({
      user: req.user.id,
      organization,
    });

    if (existingApplication) {
      return next(
        new AppError("You have already applied to this organization", 400)
      );
    }

    const newApplication = await VolunteerApplication.create({
      user: req.user.id,
      organization,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()),
      availability,
      motivation,
    });

    res.status(201).json({
      status: "success",
      data: {
        application: newApplication,
      },
    });
  } catch (err) {
    next(new AppError("Failed to submit volunteer application", 500));
  }
};

export const submitServiceOffer = async (req, res, next) => {
  try {
    const { serviceType, description, availability, location } = req.body;

    if (!serviceType || !description || !availability || !location) {
      return next(new AppError("All fields are required", 400));
    }

    const newService = await ServiceOffer.create({
      user: req.user.id,
      serviceType,
      description,
      availability,
      location,
    });

    res.status(201).json({
      status: "success",
      data: {
        service: newService,
      },
    });
  } catch (err) {
    next(new AppError("Failed to submit service offer", 500));
  }
};

export const requestDonation = async (req, res, next) => {
  try {
    const {
      donor,
      foodType,
      foodDescription,
      quantity,
      storageRequirements,
      preferredDeliveryDate,
      purpose,
      specialInstructions,
      deliveryAddress,
    } = req.body;

    if (
      !donor ||
      !foodType ||
      !foodDescription ||
      !quantity ||
      !storageRequirements ||
      !preferredDeliveryDate ||
      !purpose
    ) {
      return next(new AppError("Required fields are missing", 400));
    }

    const donorExists = await mongoose.model("User").findById(donor);
    if (!donorExists) {
      return next(new AppError("Donor not found", 404));
    }

    const newDonation = await Donation.create({
      donor,
      recipient: req.user.id,
      foodType,
      foodDescription,
      quantity: {
        value: quantity.quantity,
        unit: quantity.unit,
      },
      storageRequirements,
      preferredDeliveryDate,
      purpose,
      specialInstructions: specialInstructions || "",
      deliveryAddress: deliveryAddress || null,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      data: {
        donation: newDonation,
      },
    });
  } catch (err) {
    next(new AppError("Failed to request food donation", 500));
  }
};

export const getDonations = async (req, res, next) => {
  try {
    const userDonations = await Donation.find({ recipient: req.user.id })
      .populate("donor", "name email")
      .populate("recipient", "name email")
      .sort({ requestDate: -1 });

    res.status(200).json({
      status: "success",
      results: userDonations.length,
      data: {
        donations: userDonations,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get food donations", 500));
  }
};

export const getDonationRequests = async (req, res, next) => {
  try {
    const donationRequests = await Donation.find({
      recipient: req.user.id,
    })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: donationRequests.length,
      data: {
        requests: donationRequests,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get donation requests", 500));
  }
};

export const getDonors = async (req, res, next) => {
  try {
    const donors = await Donation.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: "$donor" } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          lastDonation: "$quantity.value",
          lastDonationUnit: "$quantity.unit",
          lastDonationType: "$foodType",
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: donors.length,
      data: {
        donors,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get donors", 500));
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    if (
      !["pending", "approved", "scheduled", "delivered", "cancelled"].includes(
        status
      )
    ) {
      return next(new AppError("Invalid status", 400));
    }

    const updateData = { status };

    if (status === "scheduled") {
      updateData.scheduledDeliveryDate = req.body.scheduledDeliveryDate;
    } else if (status === "delivered") {
      updateData.actualDeliveryDate = new Date();
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      updateData,
      { new: true }
    );

    if (!updatedDonation) {
      return next(new AppError("Donation not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        donation: updatedDonation,
      },
    });
  } catch (err) {
    next(new AppError("Failed to update donation status", 500));
  }
};
