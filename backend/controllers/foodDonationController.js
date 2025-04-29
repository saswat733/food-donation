const Donations = require('../models/foodDonationModels');

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    // Get user ID from the decoded token
    const userId = req.user.id; // Assuming you've added user ID to req.user in authMiddleware

    // Create a new donation with user ID
    const donation = new Donations({
      ...req.body,
      userId // Include userId in the donation object
    });

    await donation.save();
    res.status(201).json({ message: 'Donation successfully created!', donation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all donations for the logged-in user
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token (authMiddleware)
    const donations = await Donations.find({ userId }); // Filter by user ID

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDonations=async(req,res)=>{
  try {
    const donations=await Donations.find();

    res.status(200).json(donations)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a specific donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donations.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donations.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
