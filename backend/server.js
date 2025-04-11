// server.js or index.js
const express = require('express');
const connectDB = require('./config/db'); // Adjust the path if needed
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js'); // Import user routes
const ngoRoutes = require('./routes/ngoRoutes.js'); // Import NGO routes
const donationRoutes=require('./routes/foodDonationRoutes.js')
const contactRoutes=require("./routes/contactRoutes.js")
const volunteerRoutes = require("./routes/VolunteerRoutes.js");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',  // Remove trailing slash
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Restrict allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
  })
);

app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes); // Add your user routes here
app.use('/api/ngos', ngoRoutes); // Add your NGO routes here
app.use("/api/donations",donationRoutes)
app.use("/api/contact", contactRoutes); // Add your contact routes here
app.use("/api/volunteer", volunteerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
