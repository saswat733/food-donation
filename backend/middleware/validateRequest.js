import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validateRegistration = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .isIn(["individual", "organization", "restaurant"])
    .withMessage("Invalid user role"),

  // Role-specific validations
  body().custom((value, { req }) => {
    switch (req.body.role) {
      case "individual":
        if (!value.name) throw new Error("Name is required for individuals");
        break;
      case "organization":
        if (!value.orgName) throw new Error("Organization name is required");
        if (!value.registrationNumber)
          throw new Error("Registration number is required");
        break;
      case "restaurant":
        if (!value.restaurantName)
          throw new Error("Restaurant name is required");
        if (!value.licenseNumber) throw new Error("License number is required");
        break;
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((err) => err.msg)
        .join(". ");
      return next(new AppError(message, 400));
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((err) => err.msg)
        .join(". ");
      return next(new AppError(message, 400));
    }
    next();
  },
];
