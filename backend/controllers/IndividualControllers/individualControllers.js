// const VolunteerApplication = require("../models/VolunteerApplication");
// const ServiceOffer = require("../models/ServiceOffer");
// const Donation = require("../models/Donation");
const Organization = require("../../models/userModels").Organization;
// const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const VolunteerApplication = require("../../models/individualModels/VolunteerApplication");
const ServiceOffer = require("../../models/individualModels/ServiceOffer");
const Donation = require("../../models/individualModels/Donation");
const AppError = require("../../utils/appError");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalDonations = await Donation.aggregate([
      {
        $match: {
          recipient: mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const activeVolunteers = await VolunteerApplication.countDocuments({
      user: userId,
      status: "approved",
    });

    const serviceRequests = await ServiceOffer.countDocuments({
      user: userId,
      status: "active",
    });

    const upcomingEvents = 0; // Implement based on your events model

    res.status(200).json({
      status: "success",
      data: {
        totalDonations: totalDonations.length > 0 ? totalDonations[0].total : 0,
        activeVolunteers,
        serviceRequests,
        upcomingEvents,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get dashboard stats", 500));
  }
};

exports.getOrganizations = async (req, res, next) => {
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

exports.submitVolunteerApplication = async (req, res, next) => {
  try {

    const { organization, skills, availability, motivation } = req.body;
    console.log("hello")
    console.log(organization)
    // Validate input
    if (!organization || !skills || !availability || !motivation) {
      return next(new AppError("All fields are required", 400));
    }
    // Check if organization exists
    const orgExists = await Organization.findById(organization);
    if (!orgExists) {
        console.log("mil gya")
        return next(new AppError("Organization not found", 404));
    }
    console.log("hello1")

    // Check if user already applied
    const existingApplication = await VolunteerApplication.findOne({
      user: req.user.id,
      organization,
    });

    if (existingApplication) {
      return next(
        new AppError("You have already applied to this organization", 400)
      );
    }
    console.log("heelo")

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

exports.submitServiceOffer = async (req, res, next) => {
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

exports.requestDonation = async (req, res, next) => {
  try {
    const { donor, amount, purpose, message } = req.body;

    if (!donor || !amount || !purpose) {
      return next(new AppError("Donor, amount and purpose are required", 400));
    }
    console.log("donor", donor)
    // Check if donor exists
    const donorExists = await mongoose.model("User").findById(donor);
    if (!donorExists) {
      return next(new AppError("Donor not found", 404));
    }

    console.log(donorExists)

    const newDonation = await Donation.create({
      donor,
      recipient: req.user.id,
      amount,
      purpose,
      message: message || "",
    });

    res.status(201).json({
      status: "success",
      data: {
        donation: newDonation,
      },
    });
  } catch (err) {
    next(new AppError("Failed to request donation", 500));
  }
};

exports.getDonations = async (req, res, next) => {
  try {
    // console.log("Fetching donations for user:", req.user.id); // Debug log

    // First try without any filters to verify data exists
    const allDonations = await Donation.find({})
      .populate("donor", "name email")
      .populate("recipient", "name email")
      .sort({ donationDate: -1 });

    // console.log("All donations in DB:", allDonations); // Debug log

    // Then try with recipient filter
    const userDonations = await Donation.find({ recipient: req.user.id })
      .populate("donor", "email")
      .sort({ donationDate: -1 });

    // console.log("Filtered donations:", userDonations); // Debug log

    // Check if recipient IDs match
    const mismatchedRecipients = allDonations.filter(
      (d) =>
        d.recipient && d.recipient._id.toString() !== req.user.id.toString()
    );
    // console.log("Donations with different recipients:", mismatchedRecipients);

    res.status(200).json({
      status: "success",
      results: userDonations.length,
      data: {
        donations: userDonations,
        debug: {
          // Additional debug info
          allDonationsCount: allDonations.length,
          userDonationsCount: userDonations.length,
          userId: req.user.id,
          userIdType: typeof req.user.id,
        },
      },
    });
  } catch (err) {
    // console.error("Error in getDonations:", err);
    next(new AppError("Failed to get donations", 500));
  }
};

exports.getDonationRequests = async (req, res, next) => {
  try {
    const donationRequests = await Donation.find({
      requester: req.user.id, // Assuming you have a requester field
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

exports.getDonors = async (req, res, next) => {
  try {
    // Get users who have donated before
    const donors = await Donation.aggregate([
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
          lastDonation: "$amount",
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
