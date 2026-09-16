import express from "express";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getPublicListings,
  getPublicListingById,
} from "../controllers/crmListingController.js";

const router = express.Router();

// Public routes for website
router.get("/public", getPublicListings);
router.get("/public/:id", getPublicListingById);

// Admin routes
router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", createListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
