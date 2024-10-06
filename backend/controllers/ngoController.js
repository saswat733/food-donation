const Ngo = require('../models/ngoModels.js'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// NGO Registration
const registerNgo = async (req, res) => {
  const { email, password, organizationName, registrationNumber } = req.body;

  try {
    // Check if the NGO already exists
    let ngo = await Ngo.findOne({ email });
    if (ngo) return res.status(400).json({ message: 'NGO already exists' });

    // Create a new NGO
    ngo = new Ngo({ email, password, organizationName, registrationNumber });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    ngo.password = await bcrypt.hash(password, salt);

    await ngo.save();

    // Generate JWT
    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// NGO Sign-in
const signInNgo = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ngo = await Ngo.findOne({ email });
    if (!ngo) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Example of a protected route
const getNgoProfile = async (req, res) => {
  try {
    const ngoId = req.user.id; // Get NGO ID from the decoded token
    const ngo = await Ngo.findById(ngoId).select('-password'); // Exclude password from response
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerNgo,
  signInNgo,
  getNgoProfile,
};
