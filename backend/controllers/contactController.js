import Contact from "../models/contactModels.js";
import { sendContactConfirmationEmail } from "../services/emailService.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save to database
    await newContact.save();

    // Send confirmation email
    await sendContactConfirmationEmail({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
    });
  }
};
