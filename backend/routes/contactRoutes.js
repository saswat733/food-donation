const express = require("express");
const { handleContactForm } = require("../controllers/contactController");
const router = express.Router();

router.post("/contactform", handleContactForm);

module.exports = router;
