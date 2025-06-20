import Donation from "../../models/organizationModels/Donation.js";
import Donor from "../../models/organizationModels/Donor.js";
import Volunteer from "../../models/organizationModels/Volunteer.js";
import Inventory from "../../models/organizationModels/Inventory.js";
import Request from "../../models/organizationModels/Request.js";
import Event from "../../models/organizationModels/Event.js";
import { Organization } from "../../models/userModels.js";
import calculateStats from "../../utils/statsCalculator.js";
import AppError from "../../utils/AppError.js";

// @desc    Get all donations for organization
// @route   GET /api/v1/org/donations
// @access  Private (Organization)
export const getDonations = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const donations = await Donation.find({ organization: req.user.id })
      .populate("donor", "name email phone")
      .sort("-date");

    res.status(200).json({
      status: "success",
      results: donations.length,
      data: { donations },
    });
  } catch (err) {
    next(err);
  }
};

export const createDonor = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create donors", 403));
    }

    req.body.organization = req.user.id;

    if (!req.body.name || !req.body.email) {
      return next(new AppError("Name and email are required", 400));
    }

    const existingDonor = await Donor.findOne({
      email: req.body.email,
      organization: req.user.id,
    });

    if (existingDonor) {
      return next(new AppError("Donor with this email already exists", 400));
    }

    const donor = await Donor.create(req.body);

    res.status(201).json({
      status: "success",
      data: { donor },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    if (err.code === 11000) {
      return next(new AppError("Email already exists", 400));
    }
    next(err);
  }
};

// @desc    Update a donor
// @route   PUT /api/v1/org/donors/:id
// @access  Private (Organization)
export const updateDonor = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can update donors", 403));
    }

    const donor = await Donor.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!donor) {
      return next(new AppError("No donor found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { donor },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    if (err.code === 11000) {
      return next(new AppError("Email already exists", 400));
    }
    next(err);
  }
};

// @desc    Delete a donor
// @route   DELETE /api/v1/org/donors/:id
// @access  Private (Organization)
export const deleteDonor = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can delete donors", 403));
    }

    const donor = await Donor.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.id,
    });

    if (!donor) {
      return next(new AppError("No donor found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single donor
// @route   GET /api/v1/org/donors/:id
// @access  Private (Organization)
export const getDonor = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const donor = await Donor.findOne({
      _id: req.params.id,
      organization: req.user.id,
    });

    if (!donor) {
      return next(new AppError("No donor found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { donor },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record new donation
// @route   POST /api/v1/org/donations
// @access  Private (Organization)
export const recordDonation = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can record donations", 403));
    }

    req.body.organization = req.user.id;
    const donation = await Donation.create(req.body);

    if (req.body.donor) {
      await Donor.findByIdAndUpdate(req.body.donor, {
        $push: { donationHistory: donation._id },
      });
    }

    res.status(201).json({
      status: "success",
      data: { donation },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get all donors for organization
// @route   GET /api/v1/org/donors
// @access  Private (Organization)
export const getDonors = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const donors = await Donor.find({ organization: req.user.id }).sort(
      "-dateAdded"
    );

    res.status(200).json({
      status: "success",
      results: donors.length,
      data: { donors },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all volunteers for organization
// @route   GET /api/v1/org/volunteers
// @access  Private (Organization)
export const getVolunteers = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const volunteers = await Volunteer.find({
      organization: req.user.id,
    }).sort("-dateJoined");

    res.status(200).json({
      status: "success",
      results: volunteers.length,
      data: { volunteers },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new volunteer
// @route   POST /api/v1/org/volunteers
// @access  Private (Organization)
export const addVolunteer = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can add volunteers", 403));
    }

    req.body.organization = req.user.id;

    if (req.body.skills) {
      req.body.skills = req.body.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }
    if (req.body.availability) {
      req.body.availability = req.body.availability
        .split(",")
        .map((day) => day.trim())
        .filter((day) => day);
    }

    if (!req.body.name || !req.body.email || !req.body.phone) {
      return next(new AppError("Name, email and phone are required", 400));
    }

    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      status: "success",
      data: { volunteer },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("Email already exists for a volunteer", 400));
    }
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get inventory items for organization
// @route   GET /api/v1/org/inventory
// @access  Private (Organization)
export const getInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const inventory = await Inventory.find({
      organization: req.user.id,
    }).sort("-lastUpdated");

    res.status(200).json({
      status: "success",
      results: inventory.length,
      data: { inventory },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update inventory
// @route   POST /api/v1/org/inventory
// @access  Private (Organization)
export const updateInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can update inventory", 403));
    }

    req.body.organization = req.user.id;

    if (!req.body.foodItem || !req.body.quantity || !req.body.expiryDate) {
      return next(
        new AppError("Food item, quantity and expiry date are required", 400)
      );
    }

    const inventoryItem = await Inventory.create(req.body);

    res.status(201).json({
      status: "success",
      data: { inventory: inventoryItem },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get all requests for organization
// @route   GET /api/v1/org/requests
// @access  Private (Organization)
export const getRequests = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const requests = await Request.find({
      organization: req.user.id,
    }).sort("-dateCreated");

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: { requests },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new request
// @route   POST /api/v1/org/requests
// @access  Private (Organization)
export const createRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create requests", 403));
    }

    req.body.organization = req.user.id;

    if (!req.body.itemNeeded || !req.body.quantity || !req.body.purpose) {
      return next(
        new AppError("Item needed, quantity and purpose are required", 400)
      );
    }

    const request = await Request.create(req.body);

    res.status(201).json({
      status: "success",
      data: { request },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get all events for organization
// @route   GET /api/v1/org/events
// @access  Private (Organization)
export const getEvents = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const events = await Event.find({ organization: req.user.id })
      .populate("volunteersAssigned", "name email phone")
      .sort("date");

    res.status(200).json({
      status: "success",
      results: events.length,
      data: { events },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/v1/org/events
// @access  Private (Organization)
export const createEvent = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create events", 403));
    }

    req.body.organization = req.user.id;

    if (!req.body.name || !req.body.date || !req.body.location) {
      return next(new AppError("Name, date and location are required", 400));
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      status: "success",
      data: { event },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/v1/org/stats
// @access  Private (Organization)
export const getStats = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const stats = await calculateStats(req.user.id);

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    next(err);
  }
};
