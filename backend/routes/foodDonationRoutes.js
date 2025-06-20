import express from 'express'
const router = express.Router();
import { createDonation, getAllDonations, getDonationById, getUserDonations, updateDonationStatus } from "../controllers/foodDonationController.js"

// Public routes
router.post('/',createDonation);

// authMiddlewareed routes (require authentication)
router.get('/user/:email',  getUserDonations);

// Admin routes
router.get('/', getAllDonations);
router.get('/:id', getDonationById);
router.put('/:id/status',updateDonationStatus);

export default router
