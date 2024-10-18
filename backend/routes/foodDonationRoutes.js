const express = require('express');
const router = express.Router();
const { getUserDonations, createDonation, getAllDonations } = require('../controllers/foodDonationController.js');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/donations', authMiddleware, getUserDonations); // Protected route
router.post('/donations', authMiddleware, createDonation); // Protected route

router.get('/all-donations',getAllDonations);


module.exports = router;
