import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
// import Organization from "../../models/userModels/Organization.js";
import VolunteerApplication from "../../models/individualModels/VolunteerApplication.js";
import ServiceOffer from "../../models/individualModels/ServiceOffer.js";
// import Donation from "../../models/individualModels/Donation.js";
import { Organization, User } from "../../models/userModels.js";
import Donation from "../../models/individualModels/Donation.js";
import Volunteer from "../../models/organizationModels/Volunteer.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Helper function to calculate percentage change
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? "+∞%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
    };

    // Total Donations (where user is donor)
    const totalDonations = await Donation.countDocuments({
      donor: new mongoose.Types.ObjectId(userId),
      status: "delivered",
    });

    const previousDonations = await Donation.countDocuments({
      donor: new mongoose.Types.ObjectId(userId),
      status: "delivered",
      createdAt: { $lt: thirtyDaysAgo },
    });
    const donationChange = calculateChange(totalDonations, previousDonations);

    // Volunteer Applications
    const activeVolunteers = await VolunteerApplication.countDocuments({
      user: userId,
      status: "approved",
    });

    const previousVolunteers = await VolunteerApplication.countDocuments({
      user: userId,
      status: "approved",
      createdAt: { $lt: thirtyDaysAgo },
    });
    const volunteerChange = (activeVolunteers - previousVolunteers).toString();

    // Service Offers
    const serviceRequests = await ServiceOffer.countDocuments({
      user: userId,
      status: "active",
    });

    const previousServices = await ServiceOffer.countDocuments({
      user: userId,
      status: "active",
      createdAt: { $lt: thirtyDaysAgo },
    });
    const serviceChange = calculateChange(serviceRequests, previousServices);

    // Upcoming Events (placeholder - implement based on your events model)
    const upcomingEvents = 0;

    res.status(200).json({
      status: "success",
      data: {
        totalDonations,
        donationChange,
        activeVolunteers,
        volunteerChange,
        serviceRequests,
        serviceChange,
        upcomingEvents,
        // Additional breakdowns if needed
        volunteerStatusBreakdown: await VolunteerApplication.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        serviceStatusBreakdown: await ServiceOffer.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      },
    });
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    next(new AppError("Failed to get dashboard stats", 500));
  }
};

export const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find();

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

    // Validate required fields
    if (!organization || !skills || !availability || !motivation) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if organization exists
    const orgExists = await User.findById(organization); // Assuming orgs are stored in User model
    if (!orgExists || orgExists.role !== "organization") {
      return next(new AppError("Organization not found", 404));
    }
    console.log("req.user.id", req.user.id);
    // Check for existing application (not volunteer!)
    const existingApplication = await VolunteerApplication.findOne({
      user: req.user.id,
      organization,
      status: { $ne: "rejected" }, // Allow reapplication if previously rejected
    });
    console.log("existingApplication", existingApplication);

    if (existingApplication) {
      return next(
        new AppError(
          "You already have a pending or approved application with this organization",
          400
        )
      );
    }

    // Create the application (using VolunteerApplication model)
    const newApplication = await VolunteerApplication.create({
      user: req.user.id,
      organization,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()),
      availability,
      motivation,
      status: "pending", // Explicitly set status
    });

    res.status(201).json({
      status: "success",
      data: { application: newApplication },
    });
  } catch (err) {
    console.error("Application submission error:", err);
    next(new AppError(err.message, 500)); // Forward specific error
  }
};

export const submitServiceOffer = async (req, res, next) => {
  try {
    const { serviceType, description, availability, location } = req.body;
    console.log(serviceType, description, availability, location);
    if (!serviceType || !description || !availability || !location) {
      return next(new AppError("All fields are required", 400));
    }
    console.log("req",req.user.id);

    const newService = await ServiceOffer.create({
      user: req.user.id,
      serviceType,
      description,
      availability,
      location,
    });
    console.log(newService);
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
      foodType,
      foodDescription,
      quantity,
      storageRequirements,
      preferredDeliveryDate,
      purpose,
      specialInstructions,
      deliveryAddress,
    } = req.body;
    console.log("Request body:", req.body);
    // Validate required fields
    if (
      !foodType ||
      !foodDescription ||
      !quantity ||
      !storageRequirements ||
      !preferredDeliveryDate ||
      !purpose
    ) {
      return next(new AppError("Required fields are missing", 400));
    }

    // Automatically set the donor to the logged-in user (individual)
    const donor = req.user.id;

    // Validate donor (must be an individual)
    const donorExists = await mongoose.model("User").findById(donor);
    if (!donorExists || donorExists.role !== "individual") {
      return next(new AppError("Invalid donor: Must be an individual", 400));
    }
    console.log("donor", donorExists);

    // Recipient (NGO) must be explicitly provided in the request body
    const { donor: recipientId } = req.body;
    if (!recipientId) {
      return next(new AppError("Recipient (NGO) ID is required", 400));
    }
    console.log("recipientId", recipientId);

    // Validate recipient (must be an organization)
    const recipientExists = await mongoose.model("User").findById(recipientId);
    if (!recipientExists || recipientExists.role !== "organization") {
      return next(new AppError("Recipient must be a valid organization", 400));
    }
    console.log("recipient", recipientExists);
    // Create the donation
    const newDonation = await Donation.create({
      donor,
      recipient: recipientId, // Use the provided NGO ID
      foodType,
      foodDescription,
      quantity: {
        value: quantity.value,
        unit: quantity.unit,
      },
      storageRequirements,
      preferredDeliveryDate,
      purpose,
      specialInstructions: specialInstructions || "",
      deliveryAddress: deliveryAddress || null,
      status: "pending",
    });

    // Populate donor and recipient details
    const populatedDonation = await Donation.findById(newDonation._id)
      .populate("donor", "name email phone")
      .populate("recipient", "name email phone");

    res.status(201).json({
      status: "success",
      data: {
        donation: populatedDonation,
      },
    });
  } catch (err) {
    console.log("Error in requestDonation:", err);
    next(new AppError(err.message || "Failed to request food donation", 500));
  }
};
export const getDonations = async (req, res, next) => {
  try {
    // Get donations where the current user is either donor or recipient
    const userDonations = await Donation.find({
      $or: [{ donor: req.user.id }, { recipient: req.user.id }],
    })
      .populate("donor", "name email phone")
      .populate("recipient", "name email phone")
      .sort({ createdAt: -1 });

    if (!userDonations || userDonations.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No donations found",
        data: {
          donations: [],
        },
      });
    }

    res.status(200).json({
      status: "success",
      results: userDonations.length,
      data: {
        donations: userDonations,
      },
    });
  } catch (err) {
    console.error("Error in getDonations:", err);
    next(new AppError("Failed to get donations", 500));
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
