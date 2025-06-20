import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/errorController.js";
import connectDB from "./config/db.js";
import individualRoutes from "./routes/IndividualRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import foodDonationRoute from "./routes/foodDonationRoutes.js";
import wasteFoodCollectionRoute from "./routes/wasteFoodCollectionRoutes.js"
import vendorFoodDonationRoute from "./routes/vendorFoodDonationRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config({ path: "./config.env" });

const app = express();

// 1. Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
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
app.use("/api/v1/individual", individualRoutes);
app.use("/api/v1/org", orgRoutes);
app.use("/api/v1/dashboard/foodDonation", foodDonationRoute); 
app.use("/api/v1/dashboard/wastFoodCollection", wasteFoodCollectionRoute); 
app.use("/api/v1/dashboard/vendorFoodDonation", vendorFoodDonationRoute); 
app.use("/api/v1/dashboard/contact", contactRoutes); 

// Error handling
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
