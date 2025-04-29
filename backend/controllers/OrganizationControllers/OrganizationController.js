const Donation = require("../../models/organizationModels/Donation");
const Donor = require("../../models/organizationModels/Donor");
const Volunteer = require("../../models/organizationModels/Volunteer");
const Inventory = require("../../models/organizationModels/Inventory");
const Request = require("../../models/organizationModels/Request");
const Event = require("../../models/organizationModels/Event");
const { Organization } = require("../../models/userModels");
const calculateStats = require("../../utils/statsCalculator");
const AppError = require("../../utils/appError");

// @desc    Get all donations for organization
// @route   GET /api/v1/org/donations
// @access  Private (Organization)
exports.getDonations = async (req, res, next) => {
  try {
    // Verify organization role
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
      data: {
        donations,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createDonor = async (req, res, next) => {
  try {
    // Verify organization role
    if (req.user.role !== 'organization') {
      return next(new AppError('Only organizations can create donors', 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    // Validate required fields
    if (!req.body.name || !req.body.email) {
      return next(new AppError('Name and email are required', 400));
    }

    // Check if donor with this email already exists for this organization
    const existingDonor = await Donor.findOne({
      email: req.body.email,
      organization: req.user.id
    });

    if (existingDonor) {
      return next(new AppError('Donor with this email already exists', 400));
    }

    const donor = await Donor.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        donor
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new AppError(err.message, 400));
    }
    if (err.code === 11000) {
      return next(new AppError('Email already exists', 400));
    }
    next(err);
  }
};

// @desc    Update a donor
// @route   PUT /api/v1/org/donors/:id
// @access  Private (Organization)
exports.updateDonor = async (req, res, next) => {
  try {
    if (req.user.role !== 'organization') {
      return next(new AppError('Only organizations can update donors', 403));
    }

    const donor = await Donor.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.user.id // Ensure the donor belongs to this organization
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!donor) {
      return next(new AppError('No donor found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        donor
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new AppError(err.message, 400));
    }
    if (err.code === 11000) {
      return next(new AppError('Email already exists', 400));
    }
    next(err);
  }
};

// @desc    Delete a donor
// @route   DELETE /api/v1/org/donors/:id
// @access  Private (Organization)
exports.deleteDonor = async (req, res, next) => {
  try {
    if (req.user.role !== 'organization') {
      return next(new AppError('Only organizations can delete donors', 403));
    }

    const donor = await Donor.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.id // Ensure the donor belongs to this organization
    });

    if (!donor) {
      return next(new AppError('No donor found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single donor
// @route   GET /api/v1/org/donors/:id
// @access  Private (Organization)
exports.getDonor = async (req, res, next) => {
  try {
    if (req.user.role !== 'organization') {
      return next(new AppError('Only organizations can access this resource', 403));
    }

    const donor = await Donor.findOne({
      _id: req.params.id,
      organization: req.user.id
    });

    if (!donor) {
      return next(new AppError('No donor found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        donor
      }
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Record new donation
// @route   POST /api/v1/org/donations
// @access  Private (Organization)
exports.recordDonation = async (req, res, next) => {
  try {
    // Verify organization role
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can record donations", 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    const donation = await Donation.create(req.body);

    // Update donor's donation history
    if (req.body.donor) {
      await Donor.findByIdAndUpdate(req.body.donor, {
        $push: { donationHistory: donation._id },
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        donation,
      },
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// @desc    Get all donors for organization
// @route   GET /api/v1/org/donors
// @access  Private (Organization)
exports.getDonors = async (req, res, next) => {
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
      data: {
        donors,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all volunteers for organization
// @route   GET /api/v1/org/volunteers
// @access  Private (Organization)
exports.getVolunteers = async (req, res, next) => {
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
      data: {
        volunteers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new volunteer
// @route   POST /api/v1/org/volunteers
// @access  Private (Organization)
exports.addVolunteer = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can add volunteers", 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    // Convert skills and availability strings to arrays
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

    // Validate required fields
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return next(new AppError("Name, email and phone are required", 400));
    }

    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        volunteer,
      },
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
exports.getInventory = async (req, res, next) => {
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
      data: {
        inventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update inventory
// @route   POST /api/v1/org/inventory
// @access  Private (Organization)
exports.updateInventory = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can update inventory", 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    // Validate required fields
    if (!req.body.foodItem || !req.body.quantity || !req.body.expiryDate) {
      return next(
        new AppError("Food item, quantity and expiry date are required", 400)
      );
    }

    const inventoryItem = await Inventory.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        inventory: inventoryItem,
      },
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
exports.getRequests = async (req, res, next) => {
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
      data: {
        requests,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new request
// @route   POST /api/v1/org/requests
// @access  Private (Organization)
exports.createRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create requests", 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    // Validate required fields
    if (!req.body.itemNeeded || !req.body.quantity || !req.body.purpose) {
      return next(
        new AppError("Item needed, quantity and purpose are required", 400)
      );
    }

    const request = await Request.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        request,
      },
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
exports.getEvents = async (req, res, next) => {
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
      data: {
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/v1/org/events
// @access  Private (Organization)
exports.createEvent = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create events", 403));
    }

    // Add organization to req.body
    req.body.organization = req.user.id;

    // Validate required fields
    if (!req.body.name || !req.body.date || !req.body.location) {
      return next(new AppError("Name, date and location are required", 400));
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
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
exports.getStats = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const stats = await calculateStats(req.user.id);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    next(err);
  }
};
