const Donation = require("../models/organizationModels/Donation");
const Volunteer = require("../models/organizationModels/Volunteer");
const Inventory = require("../models/organizationModels/Inventory");
const Event = require("../models/organizationModels/Event");

const calculateStats = async (organizationId) => {
  // Get current date and date 30 days ago
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  // Get total donations
  const totalDonations = await Donation.countDocuments({
    organization: organizationId,
  });

  // Get donation change (last 30 days)
  const prevDonations = await Donation.countDocuments({
    organization: organizationId,
    date: { $lt: thirtyDaysAgo },
  });
  const recentDonations = await Donation.countDocuments({
    organization: organizationId,
    date: { $gte: thirtyDaysAgo },
  });
  const donationChange =
    prevDonations > 0
      ? `${(((recentDonations - prevDonations) / prevDonations) * 100).toFixed(
          1
        )}%`
      : "+100%";

  // Get active volunteers
  const activeVolunteers = await Volunteer.countDocuments({
    organization: organizationId,
    status: "active",
  });

  // Get volunteer change (last 30 days)
  const prevVolunteers = await Volunteer.countDocuments({
    organization: organizationId,
    status: "active",
    dateJoined: { $lt: thirtyDaysAgo },
  });
  const recentVolunteers = await Volunteer.countDocuments({
    organization: organizationId,
    status: "active",
    dateJoined: { $gte: thirtyDaysAgo },
  });
  const volunteerChange =
    prevVolunteers > 0
      ? `${(
          ((recentVolunteers - prevVolunteers) / prevVolunteers) *
          100
        ).toFixed(1)}%`
      : "+100%";

  // Get total inventory (sum of quantities)
  const inventoryItems = await Inventory.find({ organization: organizationId });
  const totalInventory = inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Get inventory change (last 30 days)
  const prevInventory = await Inventory.aggregate([
    {
      $match: {
        organization: mongoose.Types.ObjectId(organizationId),
        lastUpdated: { $lt: thirtyDaysAgo },
      },
    },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  const prevInventoryTotal =
    prevInventory.length > 0 ? prevInventory[0].total : 0;

  const recentInventory = await Inventory.aggregate([
    {
      $match: {
        organization: mongoose.Types.ObjectId(organizationId),
        lastUpdated: { $gte: thirtyDaysAgo },
      },
    },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  const recentInventoryTotal =
    recentInventory.length > 0 ? recentInventory[0].total : 0;

  const inventoryChange =
    prevInventoryTotal > 0
      ? `${(
          ((recentInventoryTotal - prevInventoryTotal) / prevInventoryTotal) *
          100
        ).toFixed(1)}%`
      : "+100%";

  // Get upcoming events (events with date >= today)
  const upcomingEvents = await Event.countDocuments({
    organization: organizationId,
    date: { $gte: new Date() },
  });

  // Get event change (last 30 days)
  const prevEvents = await Event.countDocuments({
    organization: organizationId,
    date: { $lt: thirtyDaysAgo },
  });
  const recentEvents = await Event.countDocuments({
    organization: organizationId,
    date: { $gte: thirtyDaysAgo },
  });
  const eventChange =
    prevEvents > 0
      ? `${(((recentEvents - prevEvents) / prevEvents) * 100).toFixed(1)}%`
      : "+100%";

  return {
    totalDonations,
    donationChange,
    activeVolunteers,
    volunteerChange,
    totalInventory,
    inventoryChange,
    upcomingEvents,
    eventChange,
  };
};

module.exports = calculateStats;
