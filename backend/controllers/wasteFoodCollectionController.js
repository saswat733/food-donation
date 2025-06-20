// import WasteCollection from '../models/WasteCollection.js';
import { validationResult } from 'express-validator';
import WasteCollection from '../models/wasteFoodCollectionModel.js';
import { sendWasteCollectionConfirmationEmail } from '../services/emailService.js';

const createWasteCollection = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      phone,
      address,
      wasteType,
      quantity,
      pickupDate,
      notes,
    } = req.body;

    const newRequest = await WasteCollection.create({
      name,
      email,
      phone,
      address,
      wasteType,
      quantity,
      pickupDate,
      notes,
    });

    // Send confirmation email
    await sendWasteCollectionConfirmationEmail(newRequest);

    res.status(201).json({
      success: true,
      data: newRequest,
      message: "Waste collection request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating waste collection request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit waste collection request",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all waste collection requests
 * @route   GET /api/waste-collection
 * @access  Private/Admin
 */
const getAllWasteCollections = async (req, res) => {
  try {
    const requests = await WasteCollection.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching waste collection requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste collection requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Update waste collection request status
 * @route   PUT /api/waste-collection/:id
 * @access  Private/Admin
 */
const updateWasteCollectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await WasteCollection.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste collection request not found',
      });
    }

    res.status(200).json({
      success: true,
      data: request,
      message: 'Waste collection request updated successfully',
    });
  } catch (error) {
    console.error('Error updating waste collection request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update waste collection request',
      error: error.message,
    });
  }
};

export {
  createWasteCollection,
  getAllWasteCollections,
  updateWasteCollectionStatus,
};