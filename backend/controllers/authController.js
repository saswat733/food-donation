// controllers/authController.js
const { User, Individual, Organization, Restaurant } = require('../models/userModels');
const AppError = require('../utils/AppError.js');
const jwt = require('jsonwebtoken');

// Utility function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

exports.register = async (req, res, next) => {
  try {
    console.log('Request received:', req.body);
    const { role, email, password, ...rest } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return next(new AppError('Email and password are required', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ email }).catch(err => {
      console.error('Database error:', err);
      throw new AppError('Database connection error', 500);
    });

    if (existingUser) {
      console.log('Email already in use:', email);
      return next(new AppError('Email already in use', 400));
    }

    let user;
    switch (role) {
      case 'individual':
        if (!rest.name) {
          return next(new AppError('Name is required for individuals', 400));
        }
        user = await Individual.create({
          email,
          password,
          role,
          phone: rest.phone,
          name: rest.name,
          address: rest.address
        });
        break;

      case 'organization':
        if (!rest.orgName || !rest.registrationNumber) {
          return next(new AppError('Organization name and registration number are required', 400));
        }
        user = await Organization.create({
          email,
          password,
          role,
          phone: rest.phone,
          orgName: rest.orgName,
          registrationNumber: rest.registrationNumber,
          missionStatement: rest.missionStatement
        });
        break;

      case 'restaurant':
        if (!rest.restaurantName || !rest.licenseNumber) {
          return next(new AppError('Restaurant name and license number are required', 400));
        }
        user = await Restaurant.create({
          email,
          password,
          role,
          phone: rest.phone,
          restaurantName: rest.restaurantName,
          cuisineType: rest.cuisineType,
          licenseNumber: rest.licenseNumber,
          contactPerson: rest.name
        });
        break;

      default:
        return next(new AppError('Invalid user role', 400));
    }

    user.password = undefined;
    const token = generateToken(user._id);

    console.log('Registration successful for:', email);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new AppError('Email already in use', 400));
    }
    if (err.name === 'ValidationError') {
      return next(new AppError(err.message, 400));
    }
    
    // Generic error handler
    next(new AppError('Something went wrong during registration', 500));
  }
};


// login function

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Check user exists
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Check password
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Get full user data based on role
    let userData;
    switch (user.role) {
      case 'individual':
        userData = await Individual.findById(user._id);
        break;
      case 'organization':
        userData = await Organization.findById(user._id);
        break;
      case 'restaurant':
        userData = await Restaurant.findById(user._id);
        break;
      default:
        return next(new AppError('Invalid user role', 400));
    }

    if (!userData) {
      return next(new AppError('User data not found', 404));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userData
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    let userData;
    console.log("req:",req.user.role)
    switch (req.user.role) {
      case 'individual':
        userData = await Individual.findById(req.user.id);
        break;
      case 'organization':
        userData = await Organization.findById(req.user.id);
        break;
      case 'restaurant':
        userData = await Restaurant.findById(req.user.id);
        break;
      default:
        return next(new AppError('Invalid user role', 400));
    }

    if (!userData) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: userData
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};