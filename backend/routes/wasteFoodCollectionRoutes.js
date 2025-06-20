import express from "express";
import {
  createWasteCollection,
  getAllWasteCollections,
  updateWasteCollectionStatus,
} from "../controllers/wasteFoodCollectionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post( createWasteCollection)
  .get(protect, getAllWasteCollections);

router
  .route("/:id")
  .put(protect, updateWasteCollectionStatus);

export default router;
