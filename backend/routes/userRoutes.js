const express = require('express');
const { registerUser, signInUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User sign-in
router.post('/signin', signInUser);

// Protected route to get user profile
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
