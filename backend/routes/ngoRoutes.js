const express = require('express');
const { registerNgo, signInNgo, getNgoProfile } = require('../controllers/ngoController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// NGO registration
router.post('/register', registerNgo);

// NGO sign-in
router.post('/signin', signInNgo);

// Protected route to get NGO profile
router.get('/profile', authMiddleware, getNgoProfile);

module.exports = router;
