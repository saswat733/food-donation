const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Add this line
const authRoutes = require("./routes/authRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const connectDB = require("./config/db");
const individualRoutes = require("./routes/IndividualRoutes");
const orgRoutes = require("./routes/orgRoutes");

dotenv.config({ path: "./config.env" });


const app = express();

// 1. Enable CORS - Add this before other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Optional: For preflight requests
app.options("*", cors()); // Enable preflight for all routes

// Body parser
app.use(express.json({ limit: "10kb" }));

// Database connection
connectDB();

// Test route
app.get("/success", (req, res) => {
  console.log("Welcome to the API");
  res.send("Welcome to the API");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/individual',individualRoutes);
app.use("/api/v1/org", orgRoutes);


// Error handling
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
