const Contact = require("../models/contactModels");
const handleContactForm = async (req, res) => {
  const { name, email, message } = req.body;
    console.log(name,email)
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { handleContactForm };
