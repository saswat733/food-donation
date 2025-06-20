import express from "express";
import {
  submitContactForm,
  getAllContacts,
} from "../controllers/contactController.js";

const router = express.Router();

// Public routes
router.post("/contactform", submitContactForm);

// Admin routes (protected)
router.get("/contacts", getAllContacts);

export default router;
