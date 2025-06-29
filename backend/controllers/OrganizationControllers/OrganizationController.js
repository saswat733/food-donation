import Donation from "../../models/individualModels/Donation.js";
import Donor from "../../models/organizationModels/Donor.js";
import Volunteer from "../../models/organizationModels/Volunteer.js";
import Inventory from "../../models/organizationModels/Inventory.js";
import Request from "../../models/organizationModels/Request.js";
import Event from "../../models/organizationModels/Event.js";
import { Organization, User } from "../../models/userModels.js";
import calculateStats from "../../utils/statsCalculator.js";
import AppError from "../../utils/AppError.js";
import IndividualDonation from "../../models/individualModels/Donation.js";
import VolunteerApplication from "../../models/individualModels/VolunteerApplication.js";
import OrgDonation from "../../models/organizationModels/Donation.js";

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

// @desc    Get incoming donation requests from individuals
// @route   GET /api/v1/org/incoming-donations
// @access  Private (Organization)
export const getIncomingDonations = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }
    console.log(req.user.id);

    const donations = await IndividualDonation.find({ recipient: req.user.id })
      .populate("donor", "name email")
      .sort("-requestDate");

    res.status(200).json({
      status: "success",
      results: donations.length,
      data: { donations },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update status of incoming donation
// @route   PATCH /api/v1/org/incoming-donations/:id
// @access  Private (Organization)
export const updateIncomingDonationStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(
        new AppError("Only organizations can access this resource", 403)
      );
    }

    const { status } = req.body;
    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "scheduled",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return next(new AppError("Invalid status value", 400));
    }
    console.log("status:",status)
    const donation = await IndividualDonation.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { status },
      { new: true }
    );

    if (!donation) {
      return next(new AppError("Donation not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { donation },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get filtered volunteer applications
// @route   GET /api/v1/org/volunteer-applications
// @access  Private (Organization)
export const getVolunteerApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { organization: req.user.id };
    
    if (status) filter.status = status;

    const applications = await VolunteerApplication.find(filter)
      .populate("user", "name email profileImage skills")
      .sort("-createdAt")
      .lean();

    res.status(200).json({
      status: "success",
      results: applications.length,
      data: { applications },
    });
  } catch (err) {
    next(new AppError("Failed to fetch applications", 500));
  }
};

// @desc    Update application status
// @route   PATCH /api/v1/org/volunteer-applications/:id
// @access  Private (Organization)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const validStatuses = ["approved", "rejected"];

    // Validate status input
    if (!validStatuses.includes(status)) {
      return next(new AppError("Invalid status value. Must be either 'approved' or 'rejected'", 400));
    }

    // Validate rejection reason if status is rejected
    if (status === "rejected" && !rejectionReason?.trim()) {
      return next(new AppError("Rejection reason is required when rejecting an application", 400));
    }

    // Prepare update object
    const updateData = {
      status,
      processedAt: Date.now()
    };

    console.log(updateData)

    // Add rejection reason only if provided and status is rejected
    if (status === "rejected") {
      updateData.rejectionReason = rejectionReason;
    }

    // Find and update the application
    const application = await VolunteerApplication.findOneAndUpdate(
      { 
        _id: req.params.id, 
        organization: req.user.id,
        status: "pending" // Only allow updates for pending applications
      },
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "name email");
    console.log("application:", application)
    if (!application) {
      return next(new AppError("Application not found, already processed, or you don't have permission", 404));
    }

    // If approved, create volunteer record
    if (status === "approved") {
      try {
        await Volunteer.create({
          user: application.user._id,
          organization: req.user.id,
          skills: application.skills,
          availability: application.availability,
          joinedAt: Date.now(),
        });
      } catch (volunteerError) {
        console.error("Volunteer creation failed:", volunteerError);
        // Optionally handle this differently if needed
      }
    }

    res.status(200).json({
      status: "success",
      data: { application },
      message: `Application ${status} successfully`
    });

  } catch (err) {
    console.error("Error in updateApplicationStatus:", err);
    next(new AppError(err.message || "Failed to update application", 500));
  }
};


// @desc    Get application metrics
// @route   GET /api/v1/org/volunteer-applications/metrics
// @access  Private (Organization)
export const getApplicationMetrics = async (req, res, next) => {
  try {
    const metrics = await VolunteerApplication.aggregate([
      { $match: { organization: mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { metrics },
    });
  } catch (err) {
    next(new AppError("Failed to fetch metrics", 500));
  }
};



export const createDonor = async (req, res, next) => {
  try {
    console.log("req.user:", req.user)
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can create donors", 403));
    }

    req.body.organization = req.user.id;
    console.log("req.body:", req.body)
    if (!req.body.name || !req.body.email) {
      return next(new AppError("Name and email are required", 400));
    }

    const existingDonor = await Donor.findOne({
      email: req.body.email,
      organization: req.user.id,
    });

    console.log("existingDonor:", existingDonor)

    if (existingDonor) {
      return next(new AppError("Donor with this email already exists", 400));
    }

    const donor = await Donor.create(req.body);
    console.log("donor:", donor)
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
    console.log("req.user:",req.user)
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can record donations", 403));
    }
    console.log("req:",req.body)
    req.body.organization = req.user.id;
    const donation = await OrgDonation.create(req.body);
    console.log("donation:",donation)
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
export const getAllOrgVolunteerRecords = async (req, res, next) => {
  try {
    const { status, type } = req.query; // Optional filters
    const organizationId =  req.user.id; // From URL or logged-in org
    // console.log("organizationId:", organizationId);
    // Validate organization (optional)
    const orgExists = await User.findById(organizationId);
    // console.log("orgExists:", orgExists);
    if (!orgExists || orgExists.role !== "organization") {
      console.error("Organization not found or invalid role");
      return next(new AppError("Organization not found", 404));
    }

    // console.log("org:", orgExists);

    // 1. Fetch applications for this org
    const applications = await VolunteerApplication.find({
      organization: organizationId,
      ...(status && { status }), // Filter by application status
      ...(type === "application" && { _id: { $exists: true } }), // Force filter if type=application
    })
      .populate("user", "name email phone avatar")
      .populate("organization", "name email");

    // 2. Fetch volunteers for this org
    const volunteers = await Volunteer.find({
      organization: organizationId,
      ...(status && { status }), // Filter by volunteer status
      ...(type === "volunteer" && { _id: { $exists: true } }), // Force filter if type=volunteer
    })
      .populate("user", "name email phone avatar")
      .populate("organization", "name email");

    // 3. Combine results
    const allRecords = [
      ...applications.map(app => ({
        type: "application",
        id: app._id,
        user: app.user,
        organization: app.organization,
        status: app.status,
        skills: app.skills,
        availability: app.availability,
        motivation: app.motivation,
        appliedAt: app.appliedAt,
      })),
      ...volunteers.map(vol => ({
        type: "volunteer",
        id: vol._id,
        user: vol.user,
        organization: vol.organization,
        status: vol.status,
        skills: vol.skills,
        availability: vol.availability,
        joinedAt: vol.joinedAt,
        source: vol.source, // "manual" or "application"
      })),
    ];

    // console.log("allRecords:", allRecords);
    res.status(200).json({
      status: "success",
      results: allRecords.length,
      data: { records: allRecords },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};


export const getAllVolunteerRecords = async (req, res, next) => {
  try {
    const { organization, status, type } = req.query; // Optional filters

    // For organization users: restrict to their own records
    const organizationFilter =
      req.user.role === "organization"
        ? { organization: req.user._id }
        : organization
        ? { organization }
        : {};

    // 1. Fetch applications (individual applicants)
    const applications = await VolunteerApplication.find({
      ...organizationFilter,
      ...(status && { status }), // Filter by application status
      ...(type === "application" && { _id: { $exists: true } }), // Force filter if type=application
    })
      .populate("user", "name email phone avatar")
      .populate("organization", "name email");

    // 2. Fetch volunteers (approved records)
    const volunteers = await Volunteer.find({
      ...organizationFilter,
      ...(status && { status }), // Filter by volunteer status
      ...(type === "volunteer" && { _id: { $exists: true } }), // Force filter if type=volunteer
    })
      .populate("user", "name email phone avatar")
      .populate("organization", "name email");

    // 3. Combine and format results
    const allRecords = [
      ...applications.map((app) => ({
        type: "application",
        id: app._id,
        user: app.user,
        organization: app.organization,
        status: app.status,
        skills: app.skills,
        availability: app.availability,
        motivation: app.motivation,
        appliedAt: app.appliedAt,
      })),
      ...volunteers.map((vol) => ({
        type: "volunteer",
        id: vol._id,
        user: vol.user,
        organization: vol.organization,
        status: vol.status,
        skills: vol.skills,
        availability: vol.availability,
        joinedAt: vol.joinedAt,
        source: vol.source,
      })),
    ];

    res.status(200).json({
      status: "success",
      results: allRecords.length,
      data: { records: allRecords },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};


export const addVolunteer = async (req, res, next) => {
  try {
    if (req.user.role !== "organization") {
      return next(new AppError("Only organizations can add volunteers", 403));
    }

    req.body.organization = req.user.id;

    // Either require user field or set it to undefined (not null)
    if (!req.body.user) {
      req.body.user = undefined; // This won't trigger the unique index
    }

    // Process skills if provided
    if (req.body.skills && typeof req.body.skills === "string") {
      req.body.skills = req.body.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    // Validate availability
    if (req.body.availability) {
      const validOptions = ["weekdays", "weekends", "both", "flexible"];
      if (!validOptions.includes(req.body.availability)) {
        return next(new AppError("Invalid availability value", 400));
      }
    }

    if (!req.body.name || !req.body.email || !req.body.phone) {
      return next(new AppError("Name, email and phone are required", 400));
    }

    // Check if volunteer with this email already exists for the organization
    const existingVolunteer = await Volunteer.findOne({
      organization: req.body.organization,
      email: req.body.email,
    });

    if (existingVolunteer) {
      return next(
        new AppError(
          "A volunteer with this email already exists for your organization",
          400
        )
      );
    }

    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      status: "success",
      data: { volunteer },
    });
  } catch (err) {
    console.error("Error creating volunteer:", err);
    if (err.code === 11000) {
      return next(
        new AppError("Volunteer already exists for this organization", 400)
      );
    }
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

// pendinggggggggggggggggggggggg


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
