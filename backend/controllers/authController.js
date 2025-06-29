import {
  User,
  Individual,
  Organization,
  Restaurant,
} from "../models/userModels.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

// Utility function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register function
export const register = async (req, res, next) => {
  try {
    console.log("Request received:", req.body);
    const { role, email, password, ...rest } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return next(new AppError("Email and password are required", 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ email }).catch((err) => {
      console.error("Database error:", err);
      throw new AppError("Database connection error", 500);
    });

    if (existingUser) {
      console.log("Email already in use:", email);
      return next(new AppError("Email already in use", 400));
    }

    let user;
    switch (role) {
      case "individual":
        if (!rest.name) {
          return next(new AppError("Name is required for individuals", 400));
        }
        user = await Individual.create({
          email,
          password,
          role,
          phone: rest.phone,
          name: rest.name,
          address: rest.address,
        });
        break;

      case "organization":
        if (!rest.orgName || !rest.registrationNumber) {
          return next(
            new AppError(
              "Organization name and registration number are required",
              400
            )
          );
        }
        user = await Organization.create({
          email,
          password,
          role,
          phone: rest.phone,
          orgName: rest.orgName,
          registrationNumber: rest.registrationNumber,
          missionStatement: rest.missionStatement,
        });
        break;

      case "restaurant":
        if (!rest.restaurantName || !rest.licenseNumber) {
          return next(
            new AppError("Restaurant name and license number are required", 400)
          );
        }
        user = await Restaurant.create({
          email,
          password,
          role,
          phone: rest.phone,
          restaurantName: rest.restaurantName,
          cuisineType: rest.cuisineType,
          licenseNumber: rest.licenseNumber,
          contactPerson: rest.name,
        });
        break;

      default:
        return next(new AppError("Invalid user role", 400));
    }
    console.log("organisation:", user);
    user.password = undefined;
    const token = generateToken(user._id);

    console.log("Registration successful for:", email);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle specific MongoDB errors
    if (err.name === "MongoServerError" && err.code === 11000) {
      return next(new AppError("Email already in use", 400));
    }
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }

    // Generic error handler
    next(new AppError("Something went wrong during registration", 500));
  }
};

import bcrypt from "bcryptjs";

// Login function
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    // Check user exists
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Incorrect email or password", 401));
    }
    console.log("User found:", user);

    // Direct password comparison using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return next(new AppError("Incorrect email or password", 401));
    }
    console.log("Password match for user:", email);

    // Get full user data based on role
    let userData;
    switch (user.role) {
      case "individual":
        userData = await Individual.findById(user._id);
        break;
      case "organization":
        userData = await Organization.findById(user._id);
        break;
      case "restaurant":
        userData = await Restaurant.findById(user._id);
        break;
      default:
        return next(new AppError("Invalid user role", 400));
    }

    if (!userData) {
      return next(new AppError("User data not found", 404));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: userData,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    let userData;
    console.log("req:", req.user.role);
    switch (req.user.role) {
      case "individual":
        userData = await Individual.findById(req.user.id);
        break;
      case "organization":
        userData = await Organization.findById(req.user.id);
        break;
      case "restaurant":
        userData = await Restaurant.findById(req.user.id);
        break;
      default:
        return next(new AppError("Invalid user role", 400));
    }

    if (!userData) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: userData,
      },
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Update current user's profile
// @route   PATCH /api/v1/auth/updateMe
// @access  Private
export const updateMe = async (req, res, next) => {
  // 1) Prevent password updates
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400
      )
    );
  }

  console.log(req.body)

  // 2) Define allowed fields for each role
  const roleSpecificFields = {
    individual: ["name", "address", "phone"],
    organization: [
      "orgName",
      "registrationNumber",
      "missionStatement",
      "phone",
    ],
    restaurant: [
      "restaurantName",
      "cuisineType",
      "licenseNumber",
      "contactPerson",
      "phone",
    ],
    common: ["email"], // Fields allowed for all roles
  };
  // 3) Filter request body based on user role
  const filteredBody = {};
  const allowedFields = [
    ...roleSpecificFields.common,
    ...(roleSpecificFields[req.user.role] || []),
  ];

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // 4) If email is being updated, check for duplicates
  if (filteredBody.email && filteredBody.email !== req.user.email) {
    const existingUser = await User.findOne({ email: filteredBody.email });
    if (existingUser) {
      return next(new AppError("Email is already in use", 400));
    }
  }

  // 5) Update user document based on role
  let updatedUser;
  const updateOptions = { new: true, runValidators: true };

  switch (req.user.role) {
    case "individual":
      updatedUser = await Individual.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        updateOptions
      );
      break;

    case "organization":
      updatedUser = await Organization.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        updateOptions
      );
      break;

    case "restaurant":
      updatedUser = await Restaurant.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        updateOptions
      );
      break;

    default:
      return next(new AppError("Invalid user role", 400));
  }

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  // 6) Prepare response data based on role
  let responseData;
  switch (updatedUser.role) {
    case "individual":
      responseData = {
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        name: updatedUser.name,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
      };
      break;

    case "organization":
      responseData = {
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        orgName: updatedUser.orgName,
        registrationNumber: updatedUser.registrationNumber,
        missionStatement: updatedUser.missionStatement,
        createdAt: updatedUser.createdAt,
      };
      break;

    case "restaurant":
      responseData = {
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        restaurantName: updatedUser.restaurantName,
        cuisineType: updatedUser.cuisineType,
        licenseNumber: updatedUser.licenseNumber,
        contactPerson: updatedUser.contactPerson,
        createdAt: updatedUser.createdAt,
      };
      break;
  }

  res.status(200).json({
    status: "success",
    data: {
      user: responseData,
    },
  });
};


// Logout function
export const logout = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
