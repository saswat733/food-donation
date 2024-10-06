// server.js or index.js
const express = require('express');
const connectDB = require('./config/db'); // Adjust the path if needed
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js'); // Import user routes
const ngoRoutes = require('./routes/ngoRoutes.js'); // Import NGO routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes); // Add your user routes here
app.use('/api/ngos', ngoRoutes); // Add your NGO routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
